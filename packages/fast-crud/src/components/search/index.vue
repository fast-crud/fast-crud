<template>
  <component :is="ui.collapseTransition.name" class="fs-search fs-search-v2">
    <component
      :is="ui.form.name"
      ref="searchFormRef"
      :model="form"
      v-bind="options"
      :rules="computedRules"
      class="fs-search-form"
      @compositionstart="changeInputEventDisabled(true)"
      @compositionend="changeInputEventDisabled(false)"
    >
      <component :is="container?.is" v-if="show !== false" v-bind="container" :columns="computedColumns">
        <template #search-items>
          <template v-for="(item, key) in computedColumns" :key="key">
            <div v-if="item.show === true" class="fs-search-col" v-bind="item.col">
              <component :is="ui.formItem.name" v-bind="item" :[ui.formItem.prop]="key" :label="item.title">
                <template v-if="slots['search_' + key]">
                  <fs-slot-render :slots="slots['search_' + key]" :scope="buildFieldContext(key)" />
                </template>
                <template v-else-if="item.render">
                  <fs-render :render-func="item.render" :scope="buildFieldContext(key)" />
                </template>
                <template v-else>
                  <fs-component-render
                    v-if="item.component && item.component.show !== false"
                    :ref="
                            (el:any) => {
                              if (el) {
                                componentRenderRefs[item.key] = el;
                              }
                            }
                          "
                    :model-value="get(form, key)"
                    v-bind="item.component"
                    :scope="buildFieldContext(key)"
                    @update:modelValue="onValueChanged($event, item)"
                    @input="onInput(item)"
                  />
                </template>
              </component>
            </div>
          </template>
        </template>
        <template #search-buttons>
          <template v-for="(item, index) in computedButtons" :key="index">
            <fs-button v-if="item.show" v-bind="item" @click="item._click()" />
          </template>
        </template>
        <template v-if="slots['search-right']" #search-right>
          <component :is="ui.formItem.name">
            <fs-slot-render :slots="slots['search-right']" :scope="searchEventContextRef" />
          </component>
        </template>
        <template v-if="slots['search-left']" #search-left>
          <component :is="ui.formItem.name">
            <fs-slot-render :slots="slots['search-left']" :scope="searchEventContextRef" />
          </component>
        </template>
        <template v-if="slots['search-middle']" #search-middle>
          <component :is="ui.formItem.name">
            <fs-slot-render :slots="slots['search-left']" :scope="searchEventContextRef" />
          </component>
        </template>
      </component>
    </component>
  </component>
</template>

<script lang="tsx">
import { computed, defineComponent, nextTick, reactive, ref, Ref, unref } from "vue";
import _ from "lodash-es";
import { useCompute } from "../../use/use-compute";
import { useI18n } from "../../locale";
import logger from "../../utils/util.log";
import FsSearchButtons from "./buttons.vue";
import { Constants } from "../../utils/util.constants";
import { ButtonsProps, SearchEventContext, SearchItemProps } from "../../d";
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
      type: Object,
      default() {
        return {
          is: "fs-search-layout-default"
        };
      }
    },
    /**
     * 初始查询条件
     * 点击重置，会重置成该条件
     */
    initialForm: {
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
     * tabs
     * { show , options,key, default}
     */
    tabs: {
      type: Object
    },
    /**
     * 按钮配置,可以根据order排序
     * {search:{...FsButton},reset:{...FsButton}}
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
    // /**
    //  * 布局, single-line 单行， multi-line 多行（支持展开收起）
    //  */
    // layout: {
    //   type: String,
    //   default: "single-line"
    // },
    /**
     * 列的宽度设置，span=xx
     */
    col: {}

    // /**
    //  * 是否折叠
    //  */
    // collapse: {
    //   type: Boolean,
    //   default: false
    // }
  } as any,
  emits: [
    /**
     * 查询事件
     **/
    "search",
    /**
     * 重置事件
     **/
    "reset"
  ],
  setup(props, ctx) {
    const { ui } = useUi();

    let autoSearch: any = null;
    function createInitialForm() {
      return _.cloneDeep(props.initialForm || {});
    }
    const form = reactive(createInitialForm());
    const { doComputed, AsyncComputeValue } = useCompute();

    _.each(props.columns, (item) => {
      if (item.value != null && item.value instanceof AsyncComputeValue) {
        logger.warn("search.value配置不支持AsyncCompute类型的动态计算");
      }
    });
    const { merge } = useMerge();
    const doMerge = merge;

    const get = (form: any, key: any) => {
      return _.get(form, key);
    };

    function cellRender(item: any) {
      const key = item.key;

      function _onUpdateModelValue($event: any) {
        onValueChanged($event, item);
      }
      function _onInput() {
        onInput(item);
      }

      let defaultSlot: any = null;
      if (props.slots["search_" + key]) {
        defaultSlot = <fs-slot-render slots={props.slots["search_" + key]} scope={buildFieldContext(key)} />;
      } else if (item.render) {
        defaultSlot = <fs-render render-func={item.render} scope={buildFieldContext(key)} />;
      } else if (item.component && item.component.show !== false) {
        defaultSlot = (
          <fs-component-render
            model-value={get(form, key)}
            {...item.component}
            scope={buildFieldContext(key)}
            onUpdate:modelValue={_onUpdateModelValue}
            onInput={_onInput}
          />
        );
        componentRenderRefs.value[key] = defaultSlot;
      }

      return ui.formItem.render({
        prop: key,
        label: item.title,
        props: { ...item, label: item.title },
        slots: {
          default() {
            return defaultSlot;
          }
        }
      });
    }

    const computedColumns = doComputed(
      () => {
        return props.columns;
      },
      getContextFn,
      null,
      (value) => {
        if (!props.validate) {
          //如果关闭validate则去掉rules
          _.forEach(value, (item) => {
            delete item.rules;
          });
        }
        // 合并col
        if (props.col) {
          _.forEach(value, (v) => {
            v.col = merge({}, props.col, v.col);
          });
        }

        //cellRender
        _.forEach(value, (item) => {
          item._cellRender = () => {
            return cellRender(item);
          };
        });

        //字段排序
        let sortArr: SearchItemProps[] = [];
        _.forEach(value, (v, key) => {
          v._key = key;
          sortArr.push(v);
        });
        sortArr = _.sortBy(sortArr, (item) => {
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

    //默认值
    _.forEach(computedColumns.value, (column, key) => {
      if (column.value === undefined) {
        return;
      }
      const defValue = unref(column.value);
      if (defValue !== undefined && column.show !== false && column.component?.show !== false) {
        //默认值
        form[key] = defValue;
      }
    });
    const searchFormRef = ref();
    const { t } = useI18n();
    const componentRenderRefs: Ref = ref({});
    function getComponentRenderRef(key: string) {
      return componentRenderRefs.value[key];
    }

    function getComponentRef(key: string): any {
      return getComponentRenderRef(key)?.$refs?.targetRef;
    }

    function getContextFn(): SearchEventContext {
      return { form, getComponentRef };
    }

    const searchEventContextRef: Ref<SearchEventContext> = ref(getContextFn());

    function buildFieldContext(key: string) {
      return { ...searchEventContextRef.value, key };
    }

    async function doSearch() {
      if (autoSearch) {
        // 防抖查询取消
        autoSearch.cancel();
      }

      const valid = await ui.form.validateWrap(searchFormRef.value);
      if (valid) {
        ctx.emit("search", searchEventContextRef.value);
      } else {
        ui.message.error({
          message: t("fs.search.error.message")
        });
        return false;
      }
    }

    function doReset() {
      // debugger;
      // ui.form.resetWrap(searchFormRef.value, { form, initialForm: createInitialForm() });
      const initialForm = createInitialForm();
      const entries = _.entries(form);
      for (const entry of entries) {
        const initialValue = _.get(initialForm, entry[0]);
        if (initialValue == null) {
          _.unset(form, entry[0]);
        } else {
          _.set(form, entry[0], initialValue);
        }
      }

      if (props.reset) {
        props.reset(searchEventContextRef.value);
      }
      // 表单重置事件
      ctx.emit("reset", getContextFn());
      if (props.searchAfterReset) {
        nextTick(() => {
          doSearch();
        });
      }
    }
    const computedButtons = computed(() => {
      const btns: any = [];
      const defBtnOptions: ButtonsProps<SearchEventContext> = {
        search: {
          show: true,
          type: "primary",
          disabled: false,
          click: (context: SearchEventContext) => {
            doSearch();
          },
          order: 1,
          text: t("fs.search.search.text") // '查询',
        },
        reset: {
          show: true,
          disabled: false,
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
        autoSearch = _.debounce(doSearch, wait, props.debounce);
      }
    }

    initAutoSearch();

    function getForm() {
      return form;
    }

    /**
     * 设置form值
     */
    function setForm(newForm: any, merge = true) {
      if (!merge) {
        _.each(_.keys(form), (item) => {
          delete form[item];
        });
      }
      doMerge(form, newForm);
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

    function onValueChanged(value: any, item: SearchItemProps) {
      const key = item.key;
      _.set(form, key, value);
      if (item.valueChange) {
        const key = item.key;
        const value = form[key];
        const componentRef = getComponentRef(key);
        const valueChange = item.valueChange instanceof Function ? item.valueChange : item.valueChange.handle;
        valueChange({ key, value, componentRef, ...getContextFn() });
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

    return {
      get,
      ui,
      onValueChanged,
      doSearch,
      doReset,
      form,
      componentRenderRefs,
      getComponentRenderRef,
      getComponentRef,
      getForm,
      setForm,
      searchFormRef,
      onInput,
      inputEventDisabled,
      changeInputEventDisabled,
      computedColumns,
      computedButtons,
      computedRules,
      searchEventContextRef,
      buildFieldContext
    };
  }
});
</script>
<style lang="less">
.fs-search {
  &.fs-search-v2 {
    //display: flex;
    //flex-wrap: nowrap;
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
      .fs-search-col {
        min-width: 180px;
        & > * {
          margin: 0px 5px;
        }
        margin: 5px 0;
        &:first-child {
          // margin-left: 0;
        }
      }

      .el-form-item {
        margin-bottom: 4px;
        margin-top: 4px;
        display: flex;
        align-items: center;
      }

      .el-form--inline {
        display: flex;
        align-items: center;
      }

      .el-form-item__content {
        display: flex;
        align-items: center;
      }
    }
  }
  .n-form-item-blank {
    min-width: 150px;
  }
}
</style>
