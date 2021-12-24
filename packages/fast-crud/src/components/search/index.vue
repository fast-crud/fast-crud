<template>
  <component :is="$fsui.collapseTransition.name">
    <div v-if="show !== false" class="fs-search" :class="{ 'fs-search-multi-line': computedIsMultiLine }">
      <component
        :is="$fsui.form.name"
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
              :class="{ 'fs-search-collapse': collapseRef }"
              :style="{ height: computedColumnBoxHeight }"
            >
              <component :is="$fsui.row.name" ref="columnsRowRef">
                <div class="fs-search-col">
                  <component :is="$fsui.formItem.name" v-if="slots['search-left']">
                    <fs-slot-render :slots="slots['search-left']" :scope="{ form }" />
                  </component>
                </div>
                <template v-for="(item, key) in computedColumns" :key="key">
                  <component :is="computedColName" v-if="item.show === true" class="fs-search-col" v-bind="item.col">
                    <component :is="$fsui.formItem.name" v-bind="item" :[$fsui.formItem.prop]="key" :label="item.title">
                      <template v-if="slots['search_' + key]">
                        <fs-slot-render :slots="slots['search_' + key]" :scope="{ form, key }" />
                      </template>
                      <template v-else>
                        <fs-component-render
                          v-if="item.component && item.component.show !== false"
                          :ref="
                            (el) => {
                              if (el) {
                                componentRenderRefs[item.key] = el;
                              }
                            }
                          "
                          :model-value="get(form, key)"
                          v-bind="item.component"
                          :scope="{ form }"
                          @update:modelValue="onValueChanged($event, item)"
                          @input="onInput(item)"
                        />
                      </template>
                    </component>
                  </component>
                </template>
              </component>
            </div>
            <div class="fs-search-col fs-search-middle">
              <component :is="$fsui.formItem.name" v-if="slots['search-middle']">
                <fs-slot-render :slots="slots['search-middle']" :scope="{ form }" />
              </component>
            </div>
            <div class="fs-search-col fs-search-btns">
              <component :is="$fsui.formItem.name">
                <template v-for="(item, index) in computedButtons" :key="index">
                  <fs-button v-if="item.show" v-bind="item" @click="item.click()" />
                </template>
              </component>
            </div>
            <div class="fs-search-col fs-search-right">
              <component :is="$fsui.formItem.name" v-if="slots['search-right']">
                <fs-slot-render :slots="slots['search-right']" :scope="{ form }" />
              </component>
            </div>
          </div>

          <div v-if="computedIsMultiLine" class="fs-search-action">
            <component :is="$fsui.formItem.name">
              <fs-button
                :icon="collapseRef ? 'ion:caret-up-outline' : 'ion:caret-down-outline'"
                @click="toggleCollapse"
              />
            </component>
          </div>
        </div>
      </component>
    </div>
  </component>
</template>

<script>
import { computed, nextTick, reactive, ref, unref, watch, onMounted } from "vue";
import _ from "lodash-es";
import fsButton from "../basic/fs-button";
import FsComponentRender from "../../components/render/fs-component-render";
import FsSlotRender from "../../components/render/fs-slot-render";
import { useCompute } from "../../use/use-compute";
import { uiContext } from "../../ui";
import { useI18n } from "../../locale";
import logger from "../../utils/util.log";

import { Constants } from "../../utils/util.constants";
/**
 * 查询框组件
 */
export default {
  name: "FsSearch",
  // eslint-disable-next-line vue/no-unused-components
  components: { FsComponentRender, FsSlotRender, fsButton },
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
     * 支持el-form|a-form的属性
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
     * 按钮配置
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
     */
    debounce: {
      type: Object
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
    "reset"
  ],
  setup(props, ctx) {
    const ui = uiContext.get();
    let autoSearch = null;
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
    const computedColumns = doComputed(props.columns, getContextFn, null, (value) => {
      if (!props.validate) {
        //如果关闭validate则去掉rules
        _.forEach(value, (item) => {
          delete item.rules;
        });
      }
      // 合并col
      if (props.col) {
        _.forEach(value, (v, key) => {
          v.col = _.merge({}, props.col, v.col);
        });
      }

      //字段排序
      let sortArr = [];
      _.forEach(value, (v, key) => {
        v._key = key;
        sortArr.push(v);
      });
      sortArr = _.sortBy(sortArr, (item) => {
        return item.order ?? Constants.orderDefault;
      });

      const sortedColumns = {};

      sortArr.forEach((item) => {
        let _key = item._key;
        delete item._key;
        sortedColumns[_key] = item;
      });
      return sortedColumns;
    });

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
    const componentRenderRefs = ref({});

    function getComponentRenderRef(key) {
      return componentRenderRefs.value[key];
    }

    function getComponentRef(key) {
      return getComponentRenderRef(key)?.$refs?.targetRef;
    }

    function getContextFn() {
      return { form, getComponentRef };
    }

    async function doSearch() {
      if (autoSearch) {
        // 防抖查询取消
        autoSearch.cancel();
      }

      const valid = await ui.form.validateWrap(searchFormRef.value);
      if (valid) {
        ctx.emit("search", { form });
      } else {
        ui.message.error({
          message: t("fs.search.error.message")
        });
        return false;
      }
    }

    function doReset() {
      ui.form.resetWrap(searchFormRef.value, { form, initialForm: createInitialForm() });

      if (props.reset) {
        props.reset({ form });
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
      const btns = [];
      const defBtnOptions = { search: {}, reset: {} };
      _.merge(defBtnOptions, props.buttons);
      if (defBtnOptions.search) {
        btns.push({
          show: true,
          type: "primary",
          disabled: false,
          click: () => {
            doSearch();
          },
          order: 1,
          text: t("fs.search.search.text"), // '查询',
          ...defBtnOptions.search
        });
      }
      if (defBtnOptions.reset) {
        btns.push({
          show: true,
          disabled: false,
          click: () => {
            doReset();
          },
          text: t("fs.search.reset.text"), // '重置',
          order: 2,
          ...defBtnOptions.reset
        });
      }
      btns.sort((a, b) => {
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
    function setForm(newForm, merge = true) {
      if (!merge) {
        _.each(_.keys(form), (item) => {
          delete form[item];
        });
      }
      _.merge(form, newForm);
    }

    const inputEventDisabled = ref(false);

    const doAutoSearch = () => {
      if (inputEventDisabled.value !== true && autoSearch) {
        // 防抖查询
        autoSearch();
      }
    };

    const onInput = (item) => {
      if (item.autoSearchTrigger == null || item.autoSearchTrigger === "input") {
        doAutoSearch();
      }
    };
    // 输入法监听
    const changeInputEventDisabled = (disabled) => {
      inputEventDisabled.value = disabled;
      doAutoSearch();
    };

    function onValueChanged(value, item) {
      const key = item.key;
      _.set(form, key, value);
      if (item.valueChange) {
        const key = item.key;
        const value = form[key];
        const componentRef = getComponentRef(key);
        item.valueChange({ key, value, componentRef, ...getContextFn() });
      }
      if (!item.autoSearchTrigger || item.autoSearchTrigger === "change") {
        doAutoSearch();
      }
    }

    const computedRules = computed(() => {
      if (!props.validate) {
        return [];
      }
      return props.options.rules;
    });

    //-----多行模式折叠

    const collapseRef = ref(false);
    const columnsRowRef = ref();
    const columnsBoxHeightRef = ref(0);
    const columnsLineHeightRef = ref(0);
    watch(
      () => {
        return props.collapse;
      },
      (value) => {
        collapseRef.value = value;
      }
    );

    const toggleCollapse = () => {
      collapseRef.value = !collapseRef.value;
    };

    const computedColName = computed(() => {
      if (props.layout === "multi-line") {
        return ui.col.name;
      }
      return "div";
    });
    const computedIsMultiLine = computed(() => {
      return props.layout === "multi-line";
      //不要这个，会死循环， && columnsBoxHeightRef.value > columnsLineHeightRef.value;
    });

    const computedColumnBoxHeight = computed(() => {
      if (!computedIsMultiLine.value) {
        return "auto";
      }
      if (collapseRef.value) {
        return columnsLineHeightRef.value ? columnsLineHeightRef.value + "px" : "";
      } else {
        return columnsBoxHeightRef.value ? columnsBoxHeightRef.value + "px" : "";
      }
    });

    onMounted(() => {
      if (computedIsMultiLine.value) {
        columnsBoxHeightRef.value = columnsRowRef.value.$el.offsetHeight;
        const columnsList = columnsRowRef.value.$el.children;
        if (columnsList && columnsList.length > 1) {
          columnsLineHeightRef.value = columnsList[1].offsetHeight + 2;
        }
      }
    });

    return {
      get: (form, key) => {
        return _.get(form, key);
      },
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
      collapseRef,
      columnsRowRef,
      computedColumnBoxHeight,
      computedColName,
      computedIsMultiLine,
      toggleCollapse
    };
  }
};
</script>
<style lang="less">
.fs-search {
  display: flex;
  flex-wrap: nowrap;
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
      margin: 1px;
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
    min-width: 150px;
  }
}
</style>
