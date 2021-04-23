<template>
  <component
    :is="$fsui.form.name"
    ref="formRef"
    class="fs-form"
    :class="{
      'fs-form-grid': display === 'grid',
      'fs-form-flex': display === 'flex'
    }"
    :model="form"
  >
    <!-- row -->
    <component :is="$fsui.row.name" class="fs-row" v-bind="row">
      <!-- col -->
      <template v-for="item in computedDefaultColumns" :key="item.key">
        <component :is="$fsui.col.name" v-if="item.show !== false" class="fs-col" v-bind="mergeCol(item.col)">
          <fs-form-item
            v-if="item.show !== false"
            :ref="
              (el) => {
                if (el) {
                  formItemRefs[item.key] = el;
                }
              }
            "
            :item="item"
            :model-value="get(form, item.key)"
            :slots="slots['form_' + item.key]"
            :get-context-fn="getContextFn"
            @update:modelValue="set(form, item.key, $event)"
          />
        </component>
      </template>
    </component>
    <component
      :is="computedGroup.wrapper.parent"
      v-if="computedGroup.wrapper"
      v-model:[$fsui.collapse.modelValue]="groupActiveKey"
      style="width: 100%"
      v-bind="computedGroup"
    >
      <component
        :is="computedGroup.wrapper.child"
        v-for="(groupItem, groupKey) of computedGroup.groups"
        :key="groupKey"
        :[$fsui.collapse.keyName]="groupKey"
        v-bind="groupItem"
      >
        <!-- tabPane的slots -->
        <template v-for="(item, slotName) of groupItem.slots" :key="slotName" #[slotName]="scope">
          <fs-render :render-func="item" :scope="scope" />
        </template>
        <!-- row -->
        <component :is="$fsui.row.name" class="fs-row" v-bind="row">
          <!-- col -->
          <template v-for="key in groupItem.columns" :key="key">
            <component
              :is="$fsui.col.name"
              v-if="computedColumns[key].show !== false"
              class="fs-col"
              v-bind="mergeCol(computedColumns[key].col)"
            >
              <fs-form-item
                v-if="computedColumns[key].show !== false"
                :ref="
                  (el) => {
                    if (el) {
                      formItemRefs[key] = el;
                    }
                  }
                "
                :item="computedColumns[key]"
                :model-value="get(form, key)"
                :slots="slots['form_' + key]"
                :get-context-fn="getContextFn"
                @update:modelValue="set(form, key, $event)"
              />
            </component>
          </template>
        </component>
      </component>
    </component>
  </component>
</template>

<script>
import { ref, reactive, getCurrentInstance, toRaw, computed } from "vue";
import _ from "lodash-es";
import { useCompute } from "../../use/use-compute";
import traceUtil from "../../utils/util.trace";
import FsRender from "../render/fs-render";
import logger from "../../utils/util.log";
import { uiContext } from "../../ui";
import { useMerge } from "../../use/use-merge";
import FsFormItem from "./fs-form-item.vue";

/**
 * 配置化的表单组件
 * 暴露的方法：
 * ref.submit() = 提交表单
 * ref.reset() = 重置表单
 */
export default {
  name: "FsForm",
  components: { FsFormItem, FsRender },
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
     * 点击保存按钮时执行方法
     */
    doSubmit: {
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
     * 原始行数据
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
    }
  },
  emits: ["reset", "submit", "validationError", "value-change"],
  setup(props, ctx) {
    const { merge } = useMerge();
    const ui = uiContext.get();
    const { doComputed } = useCompute();
    traceUtil.trace("fs-from");
    const formRef = ref();

    const form = reactive({});
    const { proxy } = getCurrentInstance();
    const initialForm = _.cloneDeep(props.initialForm);
    // 初始数据赋值
    _.each(props.columns, (item, key) => {
      form[key] = initialForm[key] || null;
    });
    //form.valueBuilder
    _.each(props.columns, (item, key) => {
      let value = form[key];
      if (item.valueBuilder) {
        item.valueBuilder({
          value,
          key,
          row: form,
          form,
          index: props.index,
          mode: props.mode
        });
      }
    });

    const scope = ref({
      row: initialForm,
      form,
      index: props.index,
      mode: props.mode,
      attrs: ctx.attrs,
      getComponentRef
    });

    const formItemRefs = ref({});

    function getFormItemRef(key) {
      return formItemRefs.value[key];
    }

    function getComponentRef(key) {
      return getFormItemRef(key)?.getComponentRef();
    }

    function getContextFn() {
      return scope.value;
    }

    const computedColumns = doComputed(props.columns, getContextFn);

    const groupActiveKey = ref([]);

    _.forEach(props.group?.groups, (groupItem, key) => {
      if (groupItem.collapsed !== true) {
        groupActiveKey.value.push(key);
      }
    });
    if (props.group?.groupType === "tabs") {
      groupActiveKey.value = groupActiveKey.value.length > 0 ? groupActiveKey.value[0] : null;
    }

    //构建分组数据
    const computedGroup = doComputed(props.group, getContextFn(), null, (group) => {
      if (!group) {
        return {};
      }
      //找出没有添加进分组的字段
      const groupedKeys = new Set();
      _.forEach(group?.groups, (groupItem) => {
        _.forEach(groupItem.columns, (item) => {
          groupedKeys.add(item);
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
      const merged = merge(
        {
          wrapper,
          groupedKeys
        },
        group
      );
      console.log("merged", merged);
      return merged;
    });

    const computedDefaultColumns = computed(() => {
      const columns = [];
      let index = 1;
      //default columns排序
      _.forEach(computedColumns.value, (value, key) => {
        value.key = key;
        if (value.order == null) {
          value.order = index;
        }
        index++;
        if (!computedGroup.value?.groupedKeys?.has(key)) {
          columns.push(value);
        }
        value.col = mergeCol(value.col);
      });
      //排序
      columns.sort((a, b) => {
        return a.order - b.order;
      });

      console.log("columns", columns, computedGroup.value?.defaultColumns);
      return columns;
    });

    async function getFormRef() {
      return formRef.value;
    }
    async function reset() {
      formRef.value.resetFields();
      if (props.doReset) {
        await props.doReset(scope.value);
      }
      ctx.emit("reset");
    }

    async function submit() {
      const valid = await formRef.value.validate();
      if (!valid) {
        ctx.emit("validationError", scope.value);
        return;
      }
      const formData = _.cloneDeep(toRaw(form));
      const submitScope = { ...scope.value, form: formData };
      logger.debug("form submit", JSON.stringify(form));
      _.each(props.columns, (item, key) => {
        let value = initialForm[key];
        if (item.valueResolve) {
          item.valueResolve({
            value,
            key,
            ...submitScope
          });
        }
      });

      if (props.doSubmit) {
        await props.doSubmit(submitScope);
      }
      ctx.emit("submit", submitScope);
    }

    function getFormData() {
      return form;
    }
    function setFormData(formData) {
      _.merge(form, formData);
    }

    function mergeCol(col) {
      return _.merge({}, props.col, col);
    }

    function buildItemScope(item) {
      return { key: item.key, ...scope.value };
    }
    return {
      get: _.get,
      set: (form, key, value) => {
        _.set(form, key, value);
        const event = { key, value, formRef: proxy, ...scope.value };
        ctx.emit("value-change", event);
        if (props.columns[key].valueChange) {
          props.columns[key].valueChange(event);
        }
      },
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
      computedGroup,
      getContextFn
    };
  }
};
</script>

<style lang="less">
.fs-form {
  .el-collapse-item__content {
    margin-top: 10px;
    padding-left: 30px;
    padding-right: 30px;
  }
}
.fs-form-grid {
  .fs-row {
    display: grid;
    grid-template-columns: 50% 50%;
    // gap: 0 20px; //列间距 20px
    .fs-col {
      max-width: 100%;
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

  .fs-form-helper {
    color: #7d7d7d;
    font-size: 12px;
    line-height: 1.5;
  }
}
</style>
