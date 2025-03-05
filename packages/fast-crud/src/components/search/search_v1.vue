<template>
  <component :is="ui.collapseTransition.name">
    <div v-if="show !== false" class="fs-search" :class="{ 'fs-search-multi-line': computedIsMultiLine }">
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
        <div class="fs-search-box">
          <div class="fs-search-main">
            <div
              class="fs-search-columns"
              :class="{ 'fs-search-collapse': collapse }"
              :style="{ height: computedColumnBoxHeight }"
            >
              <component :is="ui.row.name" ref="columnsRowRef">
                <div v-if="slots['search-left']" class="fs-search-col">
                  <component :is="ui.formItem.name">
                    <fs-slot-render :slots="slots['search-left']" :scope="searchEventContextRef" />
                  </component>
                </div>
                <template v-for="(item, key) in computedColumns" :key="key">
                  <component :is="computedColName" v-if="item.show === true" class="fs-search-col" v-bind="item.col">
                    <component :is="ui.formItem.name" v-bind="item" :[ui.formItem.prop]="key" :label="item.title">
                      <template v-if="slots['search_' + key]">
                        <fs-slot-render :slots="slots['search_' + key]" :scope="{ ...searchEventContextRef, key }" />
                      </template>
                      <template v-else>
                        <fs-component-render
                          v-if="item.component && item.component.show !== false"
                          :ref="
                            (el: any) => {
                              if (el) {
                                componentRenderRefs[item.key] = el;
                              }
                            }
                          "
                          :model-value="get(form, key)"
                          v-bind="item.component"
                          :scope="searchEventContextRef"
                          @update:model-value="onValueChanged($event, item)"
                          @input="onInput(item)"
                        />
                      </template>
                    </component>
                  </component>
                </template>

                <div v-if="slots['search-middle']" class="fs-search-col fs-search-middle">
                  <component :is="ui.formItem.name">
                    <fs-slot-render :slots="slots['search-middle']" :scope="searchEventContextRef" />
                  </component>
                </div>
                <fs-search-buttons v-if="!computedIsMultiLine" :buttons="computedButtons"></fs-search-buttons>
                <div v-if="slots['search-right']" class="fs-search-col fs-search-right">
                  <component :is="ui.formItem.name">
                    <fs-slot-render :slots="slots['search-right']" :scope="searchEventContextRef" />
                  </component>
                </div>
              </component>
            </div>
            <fs-search-buttons v-if="computedIsMultiLine" :buttons="computedButtons"></fs-search-buttons>
          </div>

          <div v-if="computedIsMultiLine" class="fs-search-action">
            <component :is="ui.formItem.name">
              <fs-button :icon="collapse ? ui.icons.caretUp : ui.icons.caretDown" @click="toggleCollapse" />
            </component>
          </div>
        </div>
      </component>
    </div>
  </component>
</template>

<script lang="ts">
import { computed, defineComponent, nextTick, onMounted, reactive, ref, Ref, unref } from "vue";
import { each, forEach, sortBy, entries, unset, set, keys, get } from "lodash-es";
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
  name: "FsSearchV1",
  components: { FsSearchButtons },
  inheritAttrs: false,
  props: {
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
    /**
     * 布局, single-line 单行， multi-line 多行（支持展开收起）
     */
    layout: {
      type: String,
      default: "single-line"
    },
    /**
     * 列的宽度设置，span=xx
     */
    col: {},

    /**
     * 是否折叠
     */
    collapse: {
      type: Boolean,
      default: false
    }
  },
  emits: [
    /**
     * 查询事件
     **/
    "search",
    /**
     * 重置事件
     **/
    "reset",
    "collapse",
    "update:collapse"
  ],
  setup(props, ctx) {
    const { ui } = useUi();
    // 异步setup需要放在第一个await之前
    // onMounted is called when there is no active component instance to be associated with.
    //为啥会有这个警告
    onMounted(() => {
      if (computedIsMultiLine.value && columnsRowRef.value) {
        columnsBoxHeightRef.value = columnsRowRef.value.$el.offsetHeight;
        const columnsList = columnsRowRef.value.$el.children;
        if (columnsList && columnsList.length > 1) {
          columnsLineHeightRef.value = columnsList[1].offsetHeight + 2;
        }
      }
    });

    let autoSearch: any = null;
    function createInitialForm() {
      //@ts-ignore
      return cloneDeep(props.initialForm || {});
    }
    const form = reactive(createInitialForm());
    const { doComputed, AsyncComputeValue } = useCompute();
    //@ts-ignore
    each(props.columns, (item) => {
      if (item.value != null && item.value instanceof AsyncComputeValue) {
        logger.warn("search.value配置不支持AsyncCompute类型的动态计算");
      }
    });
    const { merge } = useMerge();
    const doMerge = merge;
    const computedColumns = doComputed(
      () => {
        //@ts-ignore
        return props.columns;
      },
      getContextFn,
      null,
      (value) => {
        //@ts-ignore
        if (!props.validate) {
          //如果关闭validate则去掉rules
          forEach(value, (item) => {
            delete item.rules;
          });
        }
        // 合并col
        //@ts-ignore
        if (props.col) {
          forEach(value, (v) => {
            //@ts-ignore
            v.col = merge({}, props.col, v.col);
          });
        }

        //字段排序
        let sortArr: SearchItemProps[] = [];
        forEach(value, (v, key) => {
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

    //默认值
    forEach(computedColumns.value, (column, key) => {
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
      return { form, validatedForm: form, getComponentRef, doValidate: null };
    }

    const searchEventContextRef: Ref<SearchEventContext> = ref(getContextFn());

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
      // ui.form.resetWrap(searchFormRef.value, { form, initialForm: createInitialForm() });
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
      //@ts-ignore
      if (props.reset) {
        //@ts-ignore
        props.reset(searchEventContextRef.value);
      }
      // 表单重置事件
      ctx.emit("reset", getContextFn());
      //@ts-ignore
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
      //@ts-ignore
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
      //@ts-ignore
      if (props.autoSearch === false) {
        return;
      }
      // 构建防抖查询函数
      //@ts-ignore
      if (props.debounce !== false) {
        //@ts-ignore
        let wait = props.debounce?.wait || 500;
        //@ts-ignore
        autoSearch = debounce(doSearch, wait, props.debounce);
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
        each(keys(form), (item) => {
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
      set(form, key, value);
      if (item.valueChange) {
        const key = item.key;
        const value = form[key];
        const componentRef = getComponentRef(key);
        const valueChange = item.valueChange instanceof Function ? item.valueChange : item.valueChange.handle;
        //@ts-ignore
        valueChange({ key, value, componentRef, ...getContextFn(), immidiate: false });
      }
      if (item.autoSearchTrigger == null || item.autoSearchTrigger === true || item.autoSearchTrigger === "change") {
        doAutoSearch();
      }
    }

    const computedRules = computed(() => {
      //@ts-ignore
      if (!props.validate) {
        return [];
      }
      //@ts-ignore
      return props.options.rules;
    });

    //-----多行模式折叠

    const columnsRowRef = ref();
    const columnsBoxHeightRef = ref(0);
    const columnsLineHeightRef = ref(0);

    const toggleCollapse = () => {
      //@ts-ignore
      ctx.emit("update:collapse", !props.collapse);
      //@ts-ignore
      ctx.emit("collapse", !props.collapse);
    };

    const computedColName = computed(() => {
      //@ts-ignore
      if (props.layout === "multi-line") {
        return ui.col.name;
      }
      return "div";
    });
    const computedIsMultiLine = computed(() => {
      //@ts-ignore
      return props.layout === "multi-line";
      //不要这个，会死循环， && columnsBoxHeightRef.value > columnsLineHeightRef.value;
    });

    const computedColumnBoxHeight = computed(() => {
      if (!computedIsMultiLine.value) {
        return "auto";
      }
      //@ts-ignore
      if (props.collapse) {
        return columnsLineHeightRef.value ? columnsLineHeightRef.value + "px" : "";
      } else {
        return columnsBoxHeightRef.value ? columnsBoxHeightRef.value + "px" : "";
      }
    });

    return {
      get: (form: any, key: any) => {
        return get(form, key);
      },
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
      columnsRowRef,
      computedColumnBoxHeight,
      computedColName,
      computedIsMultiLine,
      toggleCollapse,
      searchEventContextRef
    };
  }
});
</script>
<style lang="less">
.fs-search {
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
    //& > * {
    //  margin-bottom: 4px;
    //  margin-top: 4px;
    //  margin-right: 10px;
    //}

    .fs-search-box {
      display: flex;
      .fs-search-main {
        display: flex;
        flex-direction: row;
      }
    }
    .fs-search-col {
      & > * {
        margin: 0px 5px;
      }
      margin: 1px 0;
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

  .fs-search-btns {
    .fs-button {
      margin-right: 5px;
    }
  }

  &.fs-search-multi-line {
    .fs-search-box {
      .fs-search-main {
        flex-direction: column;
        .fs-search-columns {
          height: auto;
          overflow-y: hidden;
          // transition: all 0.3s linear;
          // will-change: height;
        }
        .fs-search-btns {
          width: 100%;
          text-align: center;
          margin-top: 4px;
          .el-form-item__content {
            justify-content: center;
          }

          .n-form-item-blank {
            display: flex;
            justify-content: center;
          }
        }
      }
    }
    .fs-search-action {
      .ant-form-item {
        margin-right: 2px;
      }
    }
  }
}

.fs-search {
  .n-form-item-blank {
  }
}
</style>
