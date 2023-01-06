<template>
  <component
    :is="container?.is || 'fs-layout-default'"
    ref="containerRef"
    class="fs-crud-container"
    v-bind="container"
    :class="computedClass"
  >
    <slot></slot>

    <template #header-top>
      <slot name="header-top"></slot>
    </template>
    <template #header-bottom>
      <slot name="header-bottom"></slot>
    </template>
    <template #header-middle>
      <slot name="header-middle"></slot>
    </template>

    <template #search>
      <div class="fs-crud-search">
        <fs-search
          ref="searchRef"
          v-bind="search"
          :slots="computedSearchSlots"
          @search="onSearchSubmit"
          @reset="onSearchReset"
        />
      </div>
    </template>

    <template #actionbar>
      <div v-if="actionbar && actionbar.show !== false" class="fs-crud-actionbar">
        <slot name="actionbar-left"></slot>
        <fs-actionbar v-bind="actionbar" />
        <slot name="actionbar-right"></slot>
      </div>
    </template>

    <template #toolbar>
      <div v-if="toolbar && toolbar.show !== false" class="fs-crud-toolbar">
        <slot name="toolbar-left"></slot>
        <fs-toolbar
          v-bind="toolbar"
          :slots="computedToolbarSlots"
          :search="search.show"
          :compact="toolbar.compact"
          :columns="table.columns"
          @update:search="$emit('update:search', $event)"
          @update:compact="$emit('update:compact', $event)"
          @update:columns="$emit('update:columns', $event)"
          @refresh="$emit('refresh')"
        />
        <slot name="toolbar-right"></slot>
      </div>
    </template>

    <template #table>
      <fs-table
        ref="tableRef"
        class="fs-crud-table"
        v-bind="computedTable"
        :row-handle="rowHandle"
        :data="data"
        :cell-slots="computedCellSlots"
      />
    </template>

    <template #form>
      <div ref="innerWrapperRef" class="fs-form-wrapper-container" :class="{ 'fs-form-inner-wrapper': isFormInner }">
        <!-- 编辑对话框 -->
        <fs-form-wrapper
          ref="formWrapperRef"
          :slots="computedFormSlots"
          :inner-wrapper="innerWrapperRef"
          @inner-change="onFormInnerChange"
          @value-change="$emit('form-value-change', $event)"
        />
      </div>
    </template>

    <template #pagination>
      <div class="fs-crud-pagination">
        <div class="fs-pagination-left">
          <slot name="pagination-left"></slot>
        </div>
        <div class="fs-pagination">
          <component :is="$fsui.pagination.name" v-if="pagination.show !== false" v-bind="pagination" />
        </div>
        <div class="fs-pagination-right">
          <slot name="pagination-right"></slot>
        </div>
      </div>
    </template>

    <template #footer-top>
      <slot name="footer-top"></slot>
    </template>
    <template #footer-bottom>
      <slot name="footer-bottom"></slot>
    </template>
  </component>
</template>
<script>
import { defineComponent, computed, provide, ref, toRef, nextTick, onMounted, watch } from "vue";
import _ from "lodash-es";
import traceUtil from "../utils/util.trace";
import { uiContext } from "../ui";
import { useMerge } from "../use/use-merge";
import utilLog from "../utils/util.log";

const { merge } = useMerge();

function useProviders(props, ctx) {
  provide("get:columns", () => {
    return props.table.columns;
  });
  provide("update:columns", (columns) => {
    ctx.emit("update:columns", columns);
  });

  provide("get:crudBinding", () => {
    return props;
  });
}

function useSearch(props, ctx) {
  const searchRef = ref();
  const searchFormData = ref(_.cloneDeep(props.search.initialForm || {}));
  const onSearchSubmit = async (e) => {
    searchFormData.value = e.form;
    if (props.search.doSearch) {
      props.search.doSearch(e);
      return;
    }
    ctx.emit("search-submit", e);
  };

  const onSearchReset = (e) => {
    if (props.search.doReset) {
      props.search.doReset(e);
      return;
    }
    ctx.emit("search-reset", e);
  };

  const getSearchRef = () => {
    return searchRef.value;
  };

  const getSearchFormData = () => {
    if (searchRef.value) {
      searchFormData.value = searchRef.value.getForm();
    }
    return searchFormData.value;
  };

  /**
   * 设置form值
   * @param form form对象
   * @param opts = {
   *    isMerge:false 是否与原有form值合并,
   * }
   */
  function setSearchFormData({ form, mergeForm = false }) {
    const baseForm = {};
    if (mergeForm) {
      _.merge(baseForm, searchFormData.value, form);
    } else {
      _.merge(baseForm, form);
    }
    searchFormData.value = baseForm;
    if (searchRef.value) {
      searchRef.value.setForm(baseForm, false);
    }
  }

  return {
    searchRef,
    searchFormData,
    onSearchSubmit,
    onSearchReset,
    getSearchRef,
    getSearchFormData,
    setSearchFormData
  };
}

function slotFilter(ctxSlots, keyPrefix) {
  if (!ctxSlots) {
    return {};
  }
  const slots = {};
  _.forEach(ctxSlots, (value, key) => {
    if (key.startsWith(keyPrefix)) {
      slots[key] = value;
    }
  });
  return slots;
}

function useFixedHeight(props, ctx, { tableRef, containerRef }) {
  const ui = uiContext.get();
  if (ui.table.hasMaxHeight(props.table)) {
    return {};
  }
  if (!ui.table.fixedHeaderNeedComputeBodyHeight) {
    return {};
  }
  const maxHeightRef = ref(null);

  function computeBodyHeight() {
    const tableDom = tableRef?.value?.$el;
    if (tableDom == null || tableDom.querySelector == null) {
      return;
    }
    const headDom = tableDom.querySelector(ui.table.headerDomSelector);
    if (headDom == null) {
      return;
    }
    const tableHeight = tableDom.getBoundingClientRect().height;
    const headHeight = headDom.getBoundingClientRect().height;
    maxHeightRef.value = tableHeight - headHeight - 2;

    utilLog.debug("table max height recomputed ", maxHeightRef.value);
  }

  function watchBodyHeightChange() {
    const tableDom = tableRef.value.$el;
    if (tableDom == null) {
      return;
    }
    const tableWrapperDom = tableDom.parentNode;
    const observer = new ResizeObserver(function (entries) {
      utilLog.debug("table resized", entries);
      // 每次被观测的元素尺寸发生改变这里都会执行
      if (entries.length > 0 && entries[0].contentRect.height > 0) {
        computeBodyHeight();
      }
    });
    observer.observe(tableWrapperDom); // 观测DOM元素
  }

  onMounted(async () => {
    await nextTick();
    await nextTick();
    watchBodyHeightChange();
  });
  return { maxHeightRef, computeBodyHeight };
}

function useTable(props, ctx) {
  const ui = uiContext.get();
  const tableRef = ref();
  const containerRef = ref();
  const { maxHeightRef, computeBodyHeight } = useFixedHeight(props, ctx, { tableRef, containerRef });
  const computedTable = computed(() => {
    // antdv naive 高度自适应， 如果用户有配置scroll，则优先使用用户配置的
    let fixedHeight = {};
    if (maxHeightRef?.value != null) {
      fixedHeight = ui.table.buildMaxHeight(maxHeightRef.value);
    }
    return _.merge(fixedHeight, { ...ctx.attrs, ...props.table });
  });

  const computedToolbar = toRef(props, "toolbar");

  const computedCellSlots = computed(() => {
    return slotFilter(ctx.slots, "cell");
  });

  const computedFormSlots = computed(() => {
    return slotFilter(ctx.slots, "form");
  });
  const computedSearchSlots = computed(() => {
    return slotFilter(ctx.slots, "search");
  });
  const computedToolbarSlots = computed(() => {
    return slotFilter(ctx.slots, "toolbar");
  });
  const formWrapperRef = ref();

  const computedClass = computed(() => {
    const clazz = { compact: props.toolbar.compact !== false };
    if (props.customClass) {
      clazz[props.customClass] = true;
    }
    return clazz;
  });

  const innerWrapperRef = ref();

  const isFormInner = ref(false);
  const onFormInnerChange = (value) => {
    isFormInner.value = value;
  };

  return {
    tableRef,
    containerRef,
    computedTable,
    computedToolbar,
    computedCellSlots,
    formWrapperRef,
    isFormInner,
    onFormInnerChange,
    computedFormSlots,
    computedSearchSlots,
    computedToolbarSlots,
    computeBodyHeight,
    computedClass,
    innerWrapperRef
  };
}

/**
 * fs-crud
 */
export default defineComponent({
  name: "FsCrud",
  inheritAttrs: false,
  props: {
    /**
     * 表格配置，见FsTable
     */
    table: {
      type: Object,
      default() {
        return {};
      }
    },
    /**
     * 表格数据
     */
    data: {
      type: Array
    },
    /**
     * 操作列配置，见FsRowHandle
     */
    rowHandle: {
      type: Object,
      default() {
        return {};
      }
    },
    /**
     * 查询框配置，见FsSearch
     */
    search: {
      type: Object,
      default() {
        return {};
      }
    },
    /**
     * 工具条配置，见FsToolbar
     */
    toolbar: {
      type: Object,
      default() {
        return {};
      }
    },
    /**
     * 动作条配置，见FsActionbar
     */
    actionbar: {
      type: Object,
      default() {
        return {};
      }
    },
    /**
     * 添加表单对话框配置，见FsFormWrapper
     */
    addForm: {
      type: Object,
      default() {
        return {};
      }
    },
    /**
     * 编辑表单对话框配置，见FsFormWrapper
     */
    editForm: {
      type: Object,
      default() {
        return {};
      }
    },
    /**
     * 查看表单对话框配置，见FsFormWrapper
     */
    viewForm: {
      type: Object,
      default() {
        return {};
      }
    },
    /**
     * 翻页配置,支持el-pagination|a-pagination配置
     */
    pagination: {
      type: Object,
      default() {
        return {};
      }
    },
    /**
     * 容器配置，见FsContainer
     */
    container: {
      type: Object,
      default() {
        return {};
      }
    },

    /**
     * crud包裹容器的class
     */
    customClass: {},
    /**
     * 不要传到fs-table去
     */
    form: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  emits: [
    "search-submit",
    "search-reset",
    "refresh",
    "update:search",
    "update:compact",
    "update:columns",
    "form-value-change",
    "update:modelValue"
  ],
  setup(props, ctx) {
    traceUtil.trace("fs-crud");
    useProviders(props, ctx);
    const search = useSearch(props, ctx);
    const table = useTable(props, ctx, search);
    return {
      ...search,
      ...table
    };
  }
});
</script>
<style lang="less">
//作为数据表格使用的预设样式，隐藏footer，表格高度碎记录数增加而增加
.fs-crud-as-table {
  min-height: 0 !important;
  height: unset;

  .fs-crud-footer {
    display: none;
  }

  .box .inner {
    position: static;
  }
}

.fs-crud-container {
  min-height: 300px;

  &.compact {
    .el-table--border {
      border-left: 0;
    }

    .fs-crud-header {
      padding-left: 10px;
      padding-right: 10px;
    }

    .fs-crud-footer {
      padding-left: 10px;
      padding-right: 10px;
    }
  }

  .fs-crud-header {
    display: flex;
    padding: 10px 0;
    flex-wrap: wrap;

    .fs-header-top {
      width: 100%;
    }

    .fs-crud-search {
      width: 100%;
      grid-column: span 2;
      padding-bottom: 5px;
    }

    .fs-header-middle {
      width: 100%;
    }

    .fs-header-bottom {
      width: 100%;
    }

    .fs-crud-actionbar {
      // padding-top: 5px;
      display: flex;
      flex: 1;
      align-items: center;
    }

    .fs-crud-toolbar {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      margin-right: 10px;
    }
  }

  .fs-crud-table {
    height: 100%;
    width: 100%;
  }

  .fs-crud-footer {
    padding: 10px 0;

    .fs-crud-pagination {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;

      .fs-pagination-left {
        margin-right: 10px;
      }

      .fs-pagination-right {
        flex: 0;
      }

      .fs-pagination {
        flex: 1;

        .ant-pagination-options {
          .ant-select {
            width: auto;
          }
        }

        .el-pagination {
          padding-left: 0;
          padding-right: 0;
        }
      }

      .fs-pagination-right {
        flex: 0;
      }
    }
  }
}
</style>
