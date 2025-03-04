<template>
  <div class="fs-search fs-search-v2">
    <component :is="ui.collapseTransition.name">
      <component
        :is="ui.form.name"
        ref="searchFormRef"
        :model="formData"
        onsubmit="event.preventDefault();"
        v-bind="options"
        :rules="computedRules"
        class="fs-search-form"
        @compositionstart="changeInputEventDisabled(true)"
        @compositionend="changeInputEventDisabled(false)"
      >
        <component
          :is="container?.is || 'fs-search-layout-default'"
          v-if="show !== false"
          v-bind="container"
          :columns="computedColumns"
          :get-context-fn="getContextFn"
        >
          <template #search-buttons>
            <div class="fs-search-buttons">
              <template v-for="(item, index) in computedButtons" :key="index">
                <fs-button v-if="item.show !== false" v-bind="item" @click="item._click()" />
              </template>
            </div>
          </template>

          <template v-if="slots['search-left']" #search-left>
            <fs-slot-render :slots="slots['search-left']" :scope="getContextFn()" />
          </template>
          <template v-if="slots['search-middle']" #search-middle>
            <fs-slot-render :slots="slots['search-middle']" :scope="getContextFn()" />
          </template>
          <template v-if="slots['search-right']" #search-right>
            <fs-slot-render :slots="slots['search-right']" :scope="getContextFn()" />
          </template>
        </component>
      </component>
    </component>
  </div>
</template>

<script lang="tsx">
import { computed, defineComponent, nextTick, reactive, ref, Ref, unref, watch } from "vue";
import { forEach, cloneDeep, each, keys, unset, set, sortBy, entries, debounce, get as LodashGet } from "lodash-es";
import { useCompute } from "../../use/use-compute";
import { useI18n } from "../../locale";
import logger from "../../utils/util.log";
import FsSearchButtons from "./buttons.vue";
import { Constants } from "../../utils/util.constants";
import {
  ButtonsProps,
  SearchEventContext,
  SearchItemProps,
  TypeMap,
  ValueChangeContext,
  ValueChangeHandle
} from "../../d";
import { useUi } from "../../use/use-ui";
import { useMerge } from "../../use/use-merge";

/**
 * 查询框组件
 */
export default defineComponent({
  name: "FsSearch",
  components: { FsSearchButtons },
  inheritAttrs: false,
  props: {
    /**
     * 布局容器
     */
    container: {
      type: Object
    },
    /**
     * 初始查询条件
     * 点击重置，会重置成该条件
     */
    initialForm: {
      type: Object
    },
    /**
     * 校验后的查询表单数据
     */
    validatedForm: {
      type: Object
    },
    /**
     * 表单参数
     * 支持el-form | a-form的属性
     */
    options: {
      type: Object
    },
    /**
     * 查询字段配置
     */
    columns: {
      type: Object
    },
    /**
     * 按钮配置,可以根据order排序
     * `{search:{...FsButton},reset:{...FsButton}}`
     */
    buttons: {
      type: Object
    },
    /**
     * 点击重置后是否立即触发查询
     */
    searchAfterReset: {
      type: Boolean,
      default: true
    },
    /**
     * 是否开启自动查询
     */
    autoSearch: {
      type: Boolean,
      default: true
    },
    /**
     * 自动查询，防抖设置
     * 传false则关闭自动查询
     */
    debounce: {
      type: [Boolean, Object],
      default: undefined
    },
    /**
     * 插槽
     */
    slots: {
      type: Object,
      default() {
        return {};
      }
    },
    /**
     * 是否显示查询框
     */
    show: {
      type: Boolean,
      default: true
    },
    /**
     * 是否启用校验
     */
    validate: {
      default: false
    },

    /**
     * 是否任意值变化就触发校验
     */
    validateOnChange: {
      default: true,
      type: Boolean
    },
    /**
     * 列的宽度设置，span=xx
     */
    col: {},

    /**
     * 统一字段的formItem属性
     */
    formItem: {
      type: Object,
      default: undefined
    }
  },
  emits: [
    /**
     * 查询事件
     **/
    "search",
    /**
     * 查询事件，此事件供系统调用
     */
    "_search",
    /**
     * 重置事件，供用户使用
     **/
    "reset",
    /**
     * 重置事件，此事件供系统调用
     */
    "_reset",
    /**
     * 校验失败事件
     */
    "validate-error",
    /**
     * 校验后的表单数据变化
     */
    "update:validatedForm"
  ],
  setup(props: any, ctx: any) {
    const { ui } = useUi();
    const { merge } = useMerge();
    const doMerge = merge;
    const { doComputed, AsyncComputeValue, ComputeValue } = useCompute();
    // eslint-disable-next-line vue/no-setup-props-destructure
    each(props.columns, (item) => {
      if (item.value != null && (item.value instanceof AsyncComputeValue || item.value instanceof ComputeValue)) {
        logger.warn("search.value配置不支持ComputeValue/AsyncCompute类型的动态计算");
      }
    });

    function createInitialForm(): any {
      //默认值
      const form: any = {};

      forEach(props.columns, (column, key) => {
        if (column.value === undefined) {
          return;
        }
        const defValue = unref(column.value);
        if (defValue !== undefined && column.show !== false && column.component?.show !== false) {
          //默认值
          form[key] = defValue;
        }
      });

      return cloneDeep(merge({}, props.initialForm, form));
    }

    const formData = reactive(createInitialForm());

    let autoSearch: any = null;

    const computedColumns: Ref<TypeMap<SearchItemProps>> = doComputed(
      () => {
        return props.columns;
      },
      getContextFn,
      null,
      (columns: any) => {
        const formItem = cloneDeep(props.formItem || {});
        forEach(columns, (item) => {
          merge(item, formItem, item);
        });
        // columns = merge(formItem, columns);
        if (!props.validate) {
          //如果关闭validate则去掉rules
          forEach(columns, (item) => {
            delete item.rules;
            delete item.rule;
          });
        }
        // 合并col
        if (props.col) {
          forEach(columns, (v) => {
            v.col = merge({}, props.col, v.col);
          });
        }

        //cellRender
        forEach(columns, (item) => {
          item._cellRender = () => {
            return cellRender(item);
          };
        });

        //字段排序
        let sortArr: SearchItemProps[] = [];
        forEach(columns, (v, key) => {
          v._key = key;
          sortArr.push(v);
        });
        sortArr = sortBy(sortArr, (item) => {
          return item.order ?? Constants.orderDefault;
        });

        const sortedColumns: {
          [key: string]: SearchItemProps;
        } = {};

        sortArr.forEach((item) => {
          let _key = item._key;
          delete item._key;
          sortedColumns[_key] = item;
        });
        return sortedColumns;
      }
    );

    function onFormValidated() {
      const validatedForm = cloneDeep(formData);
      ctx.emit("update:validatedForm", validatedForm);
    }

    watch(
      () => {
        return props.validatedForm;
      },
      (value: any) => {
        for (const key in formData) {
          delete formData[key];
        }
        merge(formData, value || {});
      },
      {
        deep: true
      }
    );

    const get = (form: any, key: any) => {
      return LodashGet(form, key);
    };

    function splitKey(key: string) {
      if (key == null) {
        return;
      }
      if (key.indexOf(".") >= 0) {
        return key.split(".");
      }
      return key;
    }

    // const debounceValidate = debounce(async () => {
    //   if (await doValidate()) {
    //     onFormValidated();
    //   }
    // }, 500);

    function cellRender(item: any) {
      const key = item.key;

      async function _onUpdateModelValue($event: any) {
        // await debounceValidate();
        onValueChanged($event, item);
      }

      function _onInput() {
        onInput(item);
      }

      function onKeyup(item: any, key: any) {
        if (key.code === "Enter") {
          if (item.autoSearchTrigger === "enter") {
            doSearch();
          }
        }
      }

      let defaultSlot: any = null;
      if (props.slots["search_" + key]) {
        defaultSlot = <fs-slot-render slots={props.slots["search_" + key]} scope={buildFieldContext(key)} />;
      } else if (item.render) {
        defaultSlot = <fs-render render-func={item.render} scope={buildFieldContext(key)} />;
      } else if (item.component && item.component.show !== false) {
        defaultSlot = (
          <fs-component-render
            ref={(value: any) => {
              componentRenderRefs.value[key] = value;
            }}
            model-value={get(formData, key)}
            onKeyup={($event: any) => {
              onKeyup(item, $event);
            }}
            {...item.component}
            scope={buildFieldContext(key)}
            onUpdate:modelValue={_onUpdateModelValue}
            onInput={_onInput}
          />
        );
      }

      const splitedKey = splitKey(key);

      return ui.formItem.render({
        props: {
          ...item,
          label: item.title,
          [ui.formItem.prop]: splitedKey,
          path: key,
          rulePath: key
        },
        slots: {
          default() {
            return defaultSlot;
          }
        }
      });
    }

    const searchFormRef = ref();
    const { t } = useI18n();
    const componentRenderRefs: Ref = ref({});

    function getComponentRenderRef(key: string) {
      return componentRenderRefs.value[key];
    }

    function getComponentRef(key: string): any {
      return getComponentRenderRef(key)?.getTargetRef();
    }

    function getContextFn(): SearchEventContext {
      return { form: formData, validatedForm: props.validatedForm, getComponentRef, doSearch, doReset, doValidate };
    }

    function buildFieldContext(key: string) {
      return { ...getContextFn(), key, value: get(formData, key) };
    }

    async function doValidate(silent: boolean = false, trigger: string = "search"): Promise<boolean> {
      try {
        if (props.validate) {
          await ui.form.validateWrap(searchFormRef.value);
        }
        return true;
      } catch (e: any) {
        if (!silent) {
          ctx.emit("validate-error", { ...getContextFn(), error: e, trigger });
        }

        return false;
      }
    }

    async function doSearch() {
      if (autoSearch) {
        // 防抖查询取消
        autoSearch.cancel();
      }

      if (await doValidate()) {
        onFormValidated();
        await nextTick();
        ctx.emit("_search", getContextFn());
        ctx.emit("search", getContextFn());
      }
    }

    async function doReset() {
      // ui.form.resetWrap(searchFormRef.value, { form, initialForm: createInitialForm() });
      const initialForm = createInitialForm();
      const entriesRet = entries(formData);
      for (const entry of entriesRet) {
        const initialValue = get(initialForm, entry[0]);
        if (initialValue == null) {
          unset(formData, entry[0]);
        } else {
          set(formData, entry[0], initialValue);
        }
      }

      if (await doValidate()) {
        onFormValidated();
        await nextTick();
        if (props.reset) {
          props.reset(getContextFn());
        }
        // 表单重置事件
        ctx.emit("_reset", getContextFn());
        ctx.emit("reset", getContextFn());
        if (props.searchAfterReset) {
          doSearch();
        }
      }
    }

    const computedButtons = computed(() => {
      const btns: any = [];
      const defBtnOptions: ButtonsProps<SearchEventContext> = {
        search: {
          show: true,
          type: "primary",
          disabled: false,
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          click: (context: SearchEventContext) => {
            doSearch();
          },
          order: 1,
          text: t("fs.search.search.text") // '查询',
        },
        reset: {
          show: true,
          disabled: false,
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          click: (context: SearchEventContext) => {
            doReset();
          },
          text: t("fs.search.reset.text"), // '重置',
          order: 2
        }
      };
      merge(defBtnOptions, props.buttons);
      for (let key in defBtnOptions) {
        const btn = defBtnOptions[key];
        btn._click = () => {
          btn.click(getContextFn());
        };
        btns.push(btn);
      }

      btns.sort((a: any, b: any) => {
        return a.order - b.order;
      });
      return btns;
    });

    function initAutoSearch() {
      if (props.autoSearch === false) {
        return;
      }
      // 构建防抖查询函数
      if (props.debounce !== false) {
        let wait = props.debounce?.wait || 500;
        autoSearch = debounce(doSearch, wait, props.debounce);
      }
    }

    initAutoSearch();

    function getForm() {
      return formData;
    }

    function getValidatedForm() {
      return props.validatedForm;
    }

    /**
     * 设置form值
     */
    function setForm(newForm: any, merge = true) {
      if (!merge) {
        each(keys(formData), (item) => {
          delete formData[item];
        });
      }
      doMerge(formData, newForm);
      onFormValidated();
    }

    const inputEventDisabled = ref(false);

    const doAutoSearch = () => {
      logger.debug("do auto search,inputEventDisabled:", inputEventDisabled.value);
      if (inputEventDisabled.value !== true && autoSearch) {
        // 防抖查询
        autoSearch();
      }
    };

    const onInput = (item: any) => {
      if (item.autoSearchTrigger === "input") {
        doAutoSearch();
      }
    };
    // 输入法监听
    const changeInputEventDisabled = (disabled: boolean) => {
      inputEventDisabled.value = disabled;
      doAutoSearch();
    };

    async function onValueChanged(value: any, item: SearchItemProps) {
      const key = item.key;
      set(formData, key, value);

      const silent = props.validateOnChangeSilent;
      // if (props.validateOnChange && (await doValidate(silent, "change"))) {
      //   onFormValidated();
      // }

      if (item.valueChange) {
        const key = item.key;
        const value = formData[key];
        const componentRef = getComponentRef(key);
        const valueChange: ValueChangeHandle =
          item.valueChange instanceof Function ? item.valueChange : item.valueChange.handle;
        const scope = getContextFn();
        const valueChangeContext: ValueChangeContext = {
          index: 0,
          row: scope.form,
          form: scope.form,
          ...scope,
          key,
          value,
          componentRef,
          immediate: false,
          getComponentRef,
          mode: "search"
        };
        valueChange(valueChangeContext);
      }
      // TODO 由于validatedForm 发射出去后，会更新formData的数据，所以要放在valueChange后面,不然会死循环
      if (props.validateOnChange && (await doValidate(silent, "change"))) {
        onFormValidated();
      }
      if (item.autoSearchTrigger == null || item.autoSearchTrigger === true || item.autoSearchTrigger === "change") {
        doAutoSearch();
      }
    }

    const computedRules = computed(() => {
      if (!props.validate) {
        return [];
      }
      return props.options.rules;
    });

    onFormValidated();
    return {
      get,
      ui,
      onValueChanged,
      doValidate,
      doSearch,
      doReset,
      formData,
      componentRenderRefs,
      getComponentRenderRef,
      getComponentRef,
      getForm,
      getValidatedForm,
      setForm,
      searchFormRef,
      onInput,
      inputEventDisabled,
      changeInputEventDisabled,
      computedColumns,
      computedButtons,
      computedRules,
      buildFieldContext,
      getContextFn
    };
  }
});
</script>
<style lang="less">
.fs-search {
  &.fs-search-v2 {
    //display: flex;
    //flex-wrap: nowrap;
    .fs-search-buttons {
      display: flex;
    }
    .search-left {
    }

    .search-right {
      flex: 1;
    }

    .ant-form-inline {
      flex-wrap: wrap;
    }

    .fs-search-form {
      display: flex;
      align-items: center;
      flex-wrap: wrap;

      .ant-picker,
      .ant-select,
      .n-date-picker,
      .el-select,
      .el-date-editor {
        width: 100%;
      }

      .el-range-editor.el-input__wrapper {
        padding: 0;
      }

      .ant-btn-loading-icon {
        display: flex;
        margin-left: 2px;
        margin-right: 2px;
      }

      &.el-form--label-top {
        .el-form-item {
          display: block;
        }
      }

      .el-form-item {
        margin-bottom: 4px;
        margin-top: 4px;
        display: flex;
        align-items: center;
      }

      &.el-form--inline {
        .el-input {
          width: 100%;
        }
      }

      .el-form-item__content {
        display: flex;
        align-items: center;
      }
    }

    .fs-search-col {
      position: relative;
      // antdv
      .ant-form-item-explain,
      .el-form-item__error {
        float: left;
        position: absolute;
        bottom: 3px;
        right: 8px;
        pointer-events: none;
        top: auto;
        left: auto;
        visibility: hidden;
      }

      .el-form-item__error {
        bottom: 10px;
      }

      &:hover {
        .ant-form-item-explain,
        .el-form-item__error {
          visibility: visible;
        }
      }
    }
  }

  .n-form-item-blank {
  }
}

@media (max-width: 575px) {
  .fs-search {
    .fs-search-form {
      .fs-search-col {
        width: 100%;
        max-width: 100%;
        flex: 100%;
        //antdv
        .ant-form-item-label {
          width: 120px;
          flex: none;
        }
        .ant-form-item-control {
          flex: 1;
        }
      }
    }
  }
}
</style>
