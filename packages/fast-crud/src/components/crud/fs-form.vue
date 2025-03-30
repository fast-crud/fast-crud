<template>
  <component
    :is="ui.form.name"
    ref="formRef"
    class="fs-form"
    :class="{
      'fs-form-grid': display === 'grid',
      'fs-form-flex': display === 'flex',
      'fs-form-invalid': validRef === false
    }"
    onsubmit="event.preventDefault();"
    :model="form"
  >
    <!-- row -->
    <component :is="ui.row.name" class="fs-row" v-bind="row">
      <!-- col -->
      <template v-for="item in computedDefaultColumns" :key="item?.key">
        <component :is="ui.col.name" v-if="formItemShow(item)" class="fs-col" v-bind="item.col">
          <fs-form-item
            v-if="item.blank !== true"
            :ref="
              (el: any) => {
                if (el) {
                  formItemRefs[item.key] = el;
                }
              }
            "
            :item="item"
            :helper="helper"
            :model-value="get(form, item.key)"
            :form-slot="mergedSlots['form_' + item.key]"
            :get-context-fn="getContextFn"
            @update:model-value="set(form, item.key, $event)"
          />
        </component>
      </template>
    </component>
    <component
      :is="computedGroup.wrapper.parent"
      v-if="computedGroup.wrapper"
      v-model:[ui.collapse.modelValue]="groupActiveKey"
      style="width: 100%"
      v-bind="computedGroup"
    >
      <template v-for="(groupItem, groupKey) of computedGroup.groups" :key="groupKey">
        <component
          :is="computedGroup.wrapper.child"
          v-if="groupItemShow(groupItem)"
          :[ui.collapse.keyName]="groupKey"
          v-bind="groupItem"
          :class="{ 'fs-form-group-error': errorsRef['group.' + groupKey] }"
        >
          <template v-for="(item, slotName) of groupItem.slots" :key="slotName" #[slotName]="scope">
            <fs-render :render-func="item" :scope="{ ...scope, hasError: errorsRef['group.' + groupKey] }" />
          </template>
          <!-- row -->
          <component :is="ui.row.name" class="fs-row" v-bind="row">
            <!-- col -->
            <template v-for="key in groupItem.columns" :key="key">
              <component
                :is="ui.col.name"
                v-if="formItemShow(computedColumns[key])"
                class="fs-col"
                v-bind="mergeCol(groupItem.col, computedColumns[key]?.col)"
              >
                <fs-form-item
                  v-if="computedColumns[key] && computedColumns[key]?.blank !== true"
                  :ref="
                    (el: any) => {
                      if (el) {
                        formItemRefs[key] = el;
                      }
                    }
                  "
                  :item="computedColumns[key]"
                  :model-value="get(form, key)"
                  :form-slot="mergedSlots['form_' + key]"
                  :get-context-fn="getContextFn"
                  @update:model-value="set(form, key, $event)"
                />
              </component>
            </template>
          </component>
        </component>
      </template>
    </component>
  </component>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  getCurrentInstance,
  onMounted,
  reactive,
  Ref,
  ref,
  toRaw,
  unref,
  UnwrapNestedRefs,
  watch
} from "vue";
import { each, set, cloneDeep, entries, get, unset, forEach, merge } from "lodash-es";
import { ComputeValue, useCompute } from "../../use/use-compute";
import logger from "../../utils/util.log";
import { useMerge } from "../../use/use-merge";
import { Constants } from "../../utils/util.constants";
import { FormScopeContext, SetFormDataOptions, useUi, utils } from "../../index";

/**
 * 配置化的表单组件
 * 暴露的方法：
 * ref.submit() = 提交表单
 * ref.reset() = 重置表单
 */
export default defineComponent({
  name: "FsForm",
  props: {
    /**
     * 初始表单数据
     **/
    initialForm: {
      type: Object,
      default() {
        return {};
      }
    },
    /**
     * 字段模版
     * {
     *   key:{
     *     title: "字段名称",
     *     component:{
     *       name:"组件名称"
     *       ...组件参数
     *     }
     *   }
     * }
     * */
    columns: {
      type: Object,
      default: undefined
    },
    /**
     * 字段分组
     * {
     *   type:'xxx', //分组展示类型
     *   groups:{ //分组数据
     *     groupKey:{ title:'xxx',columns:['fieldKey','fieldKey']}
     *   }
     * }
     */
    group: {
      type: Object,
      default: undefined
    },
    /**
     * 重置表单后的操作
     */
    doReset: {
      type: Function,
      default: undefined
    },
    /**
     * 点击保存按钮，表单校验前执行操作（async）
     */
    beforeValidate: {
      type: Function,
      default: undefined
    },
    /**
     * 表单校验完完成后，提交前处理（async）
     */
    beforeSubmit: {
      type: Function,
      default: undefined
    },
    /**
     * 点击保存按钮时执行操作（async）
     */
    doSubmit: {
      type: Function,
      default: undefined
    },
    /**
     * 表单提交后处理（async）
     */
    afterSubmit: {
      type: Function,
      default: undefined
    },
    /**
     * 插槽内容
     */
    slots: {
      type: Object,
      default: () => {
        return {};
      }
    },
    /**
     * 布局方式【flex|grid】
     */
    display: {
      type: String,
      default: "flex" // flex
    },
    /**
     * 序号，编辑时会传入
     */
    index: {
      type: Number,
      default: undefined
    },
    /**
     * 模式 [add,edit,view,自定义]
     */
    mode: {
      type: String,
      default: undefined
    },
    /**
     * a-row配置
     */
    row: {
      type: Object,
      default: undefined
    },
    /**
     * el-col|a-col配置，可配置跨列
     */
    col: {
      type: Object,
      default: undefined
    },
    /**
     * formItem的公共配置
     */
    formItem: {
      type: Object,
      default: undefined
    },
    /**
     * helper位置：{position:'label'}
     */
    helper: {
      type: Object
    },

    watch: {
      type: Function,
      default: null
    }
  },
  emits: ["reset", "submit", "success", "validationError", "value-change", "init"],
  setup(props, ctx) {
    const { merge } = useMerge();
    const { ui } = useUi();
    const { AsyncComputeValue, doComputed } = useCompute();
    const formRef = ref();
    const form: UnwrapNestedRefs<any> = reactive({});
    const { proxy } = getCurrentInstance();

    utils.trace("fs-form");

    // eslint-disable-next-line vue/no-setup-props-destructure
    each(props.columns, (item: any) => {
      if (item.value != null && (item.value instanceof AsyncComputeValue || item.value instanceof ComputeValue)) {
        logger.warn("form.value配置不支持Compute/AsyncCompute类型的动态计算");
      }
    });
    function createInitialForm() {
      const form = {};
      // 初始数据赋值
      each(props.columns, (item: any, key: any) => {
        const defValue = unref(item.value);
        if (defValue !== undefined) {
          set(form, key, defValue);
        }
      });
      merge(form, cloneDeep(props.initialForm));
      return form;
    }

    const initialForm = createInitialForm();
    setFormData(initialForm);

    const scope: Ref<FormScopeContext> = computed(() => {
      return {
        row: initialForm,
        form,
        index: props.index,
        mode: props.mode || "add",
        attrs: ctx.attrs,
        getComponentRef
      } as FormScopeContext;
    });

    function getContextFn() {
      return scope.value;
    }

    const computedColumns = doComputed(() => {
      return props.columns;
    }, getContextFn);
    //form.valueBuilder

    function doValueBuilder(form: any) {
      if (form == null) {
        return;
      }
      each(props.columns, (item: any, key: any) => {
        let value = get(form, key);
        if (item.valueBuilder) {
          item.valueBuilder({
            value,
            key,
            row: initialForm,
            form,
            index: props.index,
            mode: props.mode
          });
        }
      });
    }

    function getFormData() {
      return form;
    }
    function setFormData(formData: any, options: SetFormDataOptions = {}) {
      doValueBuilder(formData);

      if (options.mergeForm === false) {
        for (const key in form) {
          delete form[key];
        }
      }
      merge(form, formData);
      const { valueChange } = options;
      if (valueChange) {
        forEach(props.columns, (column: any, key: any) => {
          const value = form[key];
          doValueChange(key, value);
        });
      }
    }

    function mergeCol(...col: any) {
      return merge({}, props.col, ...col);
    }

    function buildItemScope(item: any): FormScopeContext {
      return { key: item.key, ...scope.value };
    }

    // doValueBuilder(form);

    // watch(
    //   () => props.initialForm,
    //   () => {
    //     setFormData(createInitialForm(), { mergeForm: false });
    //   }
    // );

    function doValueChange(key: string, value: any) {
      const event = { key, value, formRef: proxy, ...scope.value, immediate: false };
      ctx.emit("value-change", event);
      let valueChange = props.columns[key].valueChange;
      if (valueChange) {
        if (valueChange instanceof Function) {
          valueChange(event);
        } else if (valueChange.handle) {
          valueChange.handle(event);
        }
      }
    }

    const formItemRefs: Ref = ref({});

    function getFormItemRef(key: string) {
      return formItemRefs.value[key];
    }

    function getComponentRef(key: string, isAsync = false) {
      return getFormItemRef(key)?.getComponentRef(isAsync);
    }

    const groupActiveKey = ref([]);

    // eslint-disable-next-line vue/no-setup-props-destructure
    forEach(props.group?.groups, (groupItem: any, key: any) => {
      if (groupItem.collapsed !== true) {
        groupActiveKey.value.push(key);
      }
    });
    // eslint-disable-next-line vue/no-setup-props-destructure
    if (props.group?.groupType === "tabs") {
      groupActiveKey.value = groupActiveKey.value.length > 0 ? groupActiveKey.value[0] : null;
    }

    //构建分组数据
    const computedGroup = doComputed(
      () => {
        return props.group;
      },
      getContextFn,
      null,
      (group) => {
        if (!group) {
          return {};
        }
        //找出没有添加进分组的字段
        const groupedKeys: any = {};
        forEach(group?.groups, (groupItem: any, key: string) => {
          forEach(groupItem.columns, (item: any) => {
            if (computedColumns.value[item] == null) {
              utils.logger.warn("无效的分组字段：" + item);
              return;
            }
            groupedKeys[item] = key;
          });
        });

        const type = group.groupType;
        let wrapper = {
          parent: ui.collapse.name,
          child: ui.collapseItem.name
        };
        if (type === "tabs") {
          wrapper.parent = ui.tabs.name;
          wrapper.child = ui.tabPane.name;
        }
        return merge(
          {
            wrapper,
            groupedKeys
          },
          group
        );
      }
    );

    const computedDefaultColumns = computed(() => {
      const columns: any = [];
      //default columns排序
      forEach(computedColumns.value, (value: any, key: string) => {
        const item = cloneDeep(props.formItem || {});
        value = merge(item, value);
        value.key = key;
        if (value.order == null) {
          value.order = Constants.orderDefault;
        }
        if (computedGroup.value?.groupedKeys == null || computedGroup.value?.groupedKeys[key] == null) {
          columns.push(value);
        }
        value.col = mergeCol(value.col);
      });
      //排序
      columns.sort((a: any, b: any) => {
        return a.order - b.order;
      });

      return columns;
    });

    function getFormRef() {
      return formRef.value;
    }
    async function reset() {
      // ui.form.resetWrap(formRef.value, { form, initialForm: createInitialForm() });
      const initialForm = createInitialForm();
      const entriesRet = entries(form);
      for (const entry of entriesRet) {
        const initialValue = get(initialForm, entry[0]);
        if (initialValue == null) {
          unset(form, entry[0]);
        } else {
          set(form, entry[0], initialValue);
        }
      }

      if (props.doReset) {
        await props.doReset(scope.value);
      }
      ctx.emit("reset");
    }

    const validRef: Ref = ref();
    const errorsRef: Ref = ref({});

    function fillGroupError(fieldErrors: any) {
      if (!computedGroup.value?.groupedKeys) {
        return;
      }
      for (let key in fieldErrors) {
        const group = computedGroup.value?.groupedKeys[key];
        if (group != null) {
          fieldErrors["group." + group] = true;
        }
      }
    }

    async function validate() {
      const validateScope = { ...scope.value, form };
      if (validateScope.mode === "view") {
        return;
      }
      if (props.beforeValidate) {
        const ret = await props.beforeValidate(validateScope);
        if (ret === false) {
          return false;
        }
      }

      try {
        errorsRef.value = {};
        await ui.form.validateWrap(formRef.value);
        validRef.value = true;
      } catch (e: any) {
        validRef.value = false;
        const validateErrors = ui.form.transformValidateErrors(e);
        fillGroupError(validateErrors);
        errorsRef.value = validateErrors;
        ctx.emit("validationError", scope.value);
        throw e;
      }
    }
    async function submit() {
      await validate();
      const formData = cloneDeep(toRaw(form));
      const submitScope = { ...scope.value, form: formData };
      logger.debug("form submit", JSON.stringify(form));
      each(props.columns, (item: any, key: string) => {
        let value = get(formData, key);
        if (item.valueResolve) {
          item.valueResolve({
            value,
            key,
            ...submitScope
          });
        }
      });

      if (props.beforeSubmit) {
        const ret = await props.beforeSubmit(submitScope);
        if (ret === false) {
          return false;
        }
      }

      //移除不允许提交的字段
      each(props.columns, (item: any, key: string) => {
        if (item.submit === false) {
          unset(formData, key);
        } else if (item.submit === true) {
          //设置强制提交的字段
          set(formData, key, formData[key]);
        }
      });

      if (props.doSubmit) {
        const res = await props.doSubmit(submitScope);
        submitScope.res = res;
        if (res === false) {
          return false;
        }
      }
      ctx.emit("submit", submitScope);
      if (props.afterSubmit) {
        const success = await props.afterSubmit(submitScope);
        if (success === false) {
          return false;
        }
      }
      ctx.emit("success", submitScope);

      return submitScope;
    }

    onMounted(() => {
      // immediate valueChange触发
      forEach(computedColumns.value, (item: any, key: string) => {
        if (item.valueChange == null) {
          return;
        }
        let valueChange = item.valueChange;
        if (valueChange && valueChange.immediate === true && valueChange.handle) {
          const event = { key, value: form[key], formRef: proxy, ...scope.value, immediate: true };
          if (valueChange.handle) {
            valueChange.handle(event);
          }
        }
      });
    });

    function formItemShow(item: any) {
      if (item && item.show !== false) {
        return true;
      }
      return false;
    }
    function groupItemShow(groupItem: any) {
      if (!groupItem.columns) {
        return false;
      }
      if (groupItem.show === false) {
        return false;
      }

      for (let key of groupItem.columns) {
        if (computedColumns.value[key] == null) {
          continue;
        }
        const isFieldShow = formItemShow(computedColumns.value[key]);
        if (isFieldShow) {
          return true;
        }
      }
      return false;
    }

    if (props.watch) {
      watch(
        () => {
          return form;
        },
        (newVal, oldVal) => {
          if (props.watch) {
            props.watch(scope.value);
          }
        },
        {
          deep: true,
          immediate: true
        }
      );
    }

    function isDirty() {
      const before = JSON.stringify(initialForm);
      const after = JSON.stringify(form);
      return before !== after;
    }

    const mergedSlots = computed(() => {
      return merge({}, props.slots, ctx.slots);
    });

    ctx.emit("init", scope.value);

    return {
      get: (form: any, key: string) => {
        return get(form, key);
      },
      set: (form: any, key: string, value: any) => {
        set(form, key, value);
        doValueChange(key, value);
      },
      ui,
      validRef,
      errorsRef,
      formRef,
      computedColumns,
      computedDefaultColumns,
      submit,
      reset,
      getFormRef,
      scope,
      buildItemScope,
      groupActiveKey,
      form,
      formItemRefs,
      getFormData,
      setFormData,
      getComponentRef,
      mergeCol,
      validate,
      computedGroup,
      getContextFn,
      formItemShow,
      groupItemShow,
      isDirty,
      mergedSlots
    };
  }
});
</script>

<style lang="less">
.fs-form {
  .el-collapse-item__content {
    margin-top: 10px;
    padding-left: 30px;
    padding-right: 30px;
  }

  .fs-form-invalid {
  }

  .fs-form-item-component {
    .ant-picker,
    .ant-input-affix-wrapper,
    .ant-input-number,
    .el-cascader,
    .el-date-editor,
    .el-input-number,
    .el-input,
    > .el-select,
    > .n-select,
    .n-date-picker,
    .n-input-number {
      width: 100%;
    }

    .el-date-editor .el-range__icon {
      margin-left: 10px;
    }
    .el-date-editor .el-range__close-icon {
      margin-right: 10px;
    }

    .el-range-editor.el-input__wrapper {
      padding: 0;
    }
  }

  //.el-date-editor.el-input__wrapper {
  //  width: 100%;
  //}
}

.fs-form-grid {
  .fs-row {
    display: grid;
    grid-template-columns: 50% 50%;
    // gap: 0 20px; //列间距 20px
    .fs-col {
      max-width: 100%;
      width: 100%;
    }

    // antdv
    .ant-form-item-label {
      width: 100px;
      flex: none;
      max-width: none;
    }
    .ant-form-item-control-wrapper {
      flex: 1;
      max-width: none;
    }
  }

  // element
  .el-row::after,
  .el-row::before {
    display: none;
  }
}
.fs-form-flex {
  display: flex;
  justify-content: flex-start;
  align-items: baseline;
  flex-wrap: wrap;
  .fs-row {
    width: 100%;
  }
}

@media (max-width: 768px) {
  .fs-form-flex {
    .fs-row {
      .fs-col {
        max-width: 100%;
        width: 100%;
        flex: 0 0 100%;
      }
    }
  }
}

@media (max-width: 575px) {
  .fs-form-flex {
    .fs-row {
      .fs-col {
        //.ant-form-item-label {
        //  flex: none;
        //}
        //.ant-form-item .ant-form-item-control {
        //  flex: 1;
        //  max-width: 100%;
        //}
      }
    }
  }
}
</style>
