<template>
  <fs-container ref="containerRef" v-bind="container" class="fs-crud-container" :class="computedClass">
    <template #header>
      <div class="fs-crud-header">
        <div class="fs-header-top"><slot name="header-top"></slot></div>
        <div class="fs-crud-search">
          <fs-search
            ref="searchRef"
            v-bind="search"
            :slots="computedSearchSlots"
            @search="onSearchSubmit"
            @reset="onSearchReset"
          />
        </div>
        <div class="fs-header-middle"><slot name="header-middle"></slot></div>

        <div v-if="actionbar && actionbar.show !== false" class="fs-crud-actionbar">
          <slot name="actionbar-left"></slot>
          <fs-actionbar v-bind="actionbar" @action="onActionHandle" />
          <slot name="actionbar-right"></slot>
        </div>

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
            @action="onToolbarHandle"
          />
          <slot name="toolbar-right"></slot>
        </div>
        <div class="fs-header-bottom">
          <slot name="header-bottom"></slot>
        </div>
      </div>
    </template>
    <!-- 默认插槽 -->
    <slot></slot>
    <!-- table -->
    <fs-table
      ref="tableRef"
      class="fs-crud-table"
      v-bind="computedTable"
      :columns="computedTable.columns"
      :row-handle="rowHandle"
      :data="data"
      :cell-slots="computedCellSlots"
      @row-handle="onRowHandle"
    />
    <!-- 编辑对话框 -->
    <fs-form-wrapper
      ref="formWrapperRef"
      :slots="computedFormSlots"
      @value-change="this.$emit('form-value-change', $event)"
    />

    <template #footer>
      <div class="fs-crud-footer">
        <slot name="footer-top"></slot>
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
        <slot name="footer-bottom"></slot>
      </div>
    </template>
  </fs-container>
</template>
<script>
import { defineComponent, computed, provide, ref, toRef, getCurrentInstance, reactive, nextTick, onMounted } from "vue";
import _ from "lodash-es";
import FsContainer from "./container/fs-container.vue";
import FsRowHandle from "./crud/fs-row-handle.vue";
import FsFormWrapper from "./crud/fs-form-wrapper.jsx";
import FsActionbar from "./actionbar/index.vue";
import FsToolbar from "./toolbar/index.vue";
import FsTable from "./crud/fs-table.jsx";
import traceUtil from "../utils/util.trace";
import { uiContext } from "../ui";
import logger from "../utils/util.log";
import { useMerge } from "../use/use-merge";
const { merge } = useMerge();
function useProviders(props, ctx) {
  provide("get:columns", () => {
    return props.table.columns;
  });
  provide("update:columns", (columns) => {
    ctx.emit("update:columns", columns);
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
      searchRef.value.setForm(form);
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
  if (!ui.table.fixedHeaderNeedComputeBodyHeight) {
    return {};
  }
  const fixedOptions = reactive({ scroll: {} });

  function computeBodyHeight() {
    const tableDom = tableRef.value.$el;
    if (tableDom == null) {
      return;
    }
    const headDom = tableDom.querySelector(".ant-table-thead");
    if (headDom == null) {
      return;
    }
    const tableHeight = tableDom.getBoundingClientRect().height;
    const headHeight = headDom.getBoundingClientRect().height;
    fixedOptions.scroll.y = tableHeight - headHeight - 2;
    fixedOptions.scroll.x = tableDom.getBoundingClientRect().width;
  }

  function watchBodyHeightChange() {
    const containerDom = containerRef.value.$el;
    if (containerDom == null) {
      return;
    }
    const tableWrapperDom = containerDom.querySelector(".inner .body");
    const observer = new ResizeObserver(function (entries) {
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
  return { fixedOptions, computeBodyHeight };
}

function useTable(props, ctx) {
  const tableRef = ref();
  const containerRef = ref();
  const fixedHeightRet = useFixedHeight(props, ctx, { tableRef, containerRef });
  const computedTable = computed(() => {
    // antdv 高度自适应， 如果用户有配置scroll，则优先使用用户配置的
    const fixedHeight = merge({}, fixedHeightRet.fixedOptions, {
      scroll: props.table.scroll
    });
    const table = { ...ctx.attrs, ...props.table, ...fixedHeight };
    return table;
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

  const { proxy } = getCurrentInstance();
  const onRowHandle = (scope) => {
    const { key } = scope;
    const tableColumnCI = proxy.$fsui.tableColumn;
    const index = scope[tableColumnCI.index];
    const row = scope[tableColumnCI.row];

    const e = { mode: key, initialForm: row, slots: ctx.slots, index };
    if (key === "edit") {
      formWrapperRef.value.open({ ...props.editForm, ...e });
    } else if (key === "view") {
      formWrapperRef.value.open({ ...props.viewForm, ...e });
    }
  };

  const onActionHandle = (e) => {
    if (e.key === "add") {
      formWrapperRef.value.open({
        ...props.addForm,
        mode: "add",
        initialForm: e.initialForm,
        slots: ctx.slots
      });
    }
  };

  const onToolbarHandle = (e) => {
    logger.debug("toolbar handle", e);
  };

  const computedClass = computed(() => {
    const clazz = { compact: props.toolbar.compact !== false };
    if (props.customClass) {
      clazz[props.customClass] = true;
    }
    return clazz;
  });

  return {
    tableRef,
    containerRef,
    computedTable,
    computedToolbar,
    computedCellSlots,
    onRowHandle,
    onActionHandle,
    onToolbarHandle,
    formWrapperRef,
    computedFormSlots,
    computedSearchSlots,
    computedToolbarSlots,
    computeBodyHeight: fixedHeightRet.computeBodyHeight,
    computedClass
  };
}

/**
 * fs-crud
 */
export default defineComponent({
  name: "FsCrud",
  components: {
    FsTable,
    FsRowHandle,
    FsContainer,
    FsFormWrapper,
    FsActionbar,
    FsToolbar
  },
  inheritAttrs: false,
  props: {
    /**
     * 表格配置，见FsTable
     */
    table: {},
    /**
     * 表格数据
     */
    data: {
      type: Array
    },
    /**
     * 操作列配置，见FsRowHandle
     */
    rowHandle: {},
    /**
     * 查询框配置，见FsSearch
     */
    search: {},
    /**
     * 工具条配置，见FsToolbar
     */
    toolbar: {},
    /**
     * 动作条配置，见FsActionbar
     */
    actionbar: {},
    /**
     * 添加表单对话框配置，见FsFormWrapper
     */
    addForm: {},
    /**
     * 编辑表单对话框配置，见FsFormWrapper
     */
    editForm: {},
    /**
     * 查看表单对话框配置，见FsFormWrapper
     */
    viewForm: {},
    /**
     * 翻页配置,支持el-pagination|a-pagination配置
     */
    pagination: {},
    /**
     * 容器配置，见FsContainer
     */
    container: {},

    /**
     * crud包裹容器的class
     */
    customClass: {}
  },
  emits: [
    "search-submit",
    "search-reset",
    "refresh",
    "update:search",
    "update:compact",
    "update:columns",
    "form-value-change"
  ],
  setup(props, ctx) {
    traceUtil.trace("fs-crud");
    useProviders();
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
.fs-crud-container {
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
