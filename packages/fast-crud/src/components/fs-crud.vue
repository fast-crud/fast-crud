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
        <component :is="search.is || 'fs-search'" ref="searchRef" v-bind="search" :slots="computedSearchSlots" />
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
        <fs-toolbar ref="toolbarRef" v-bind="toolbar" :slots="computedToolbarSlots" :columns="table.columns" />
        <slot name="toolbar-right"></slot>
      </div>
    </template>
    <template #tabs>
      <fs-tabs-filter v-if="tabsBinding.show" ref="tabsRef" class="fs-tabs" v-bind="tabsBinding" />
    </template>
    <template #table>
      <fs-table
        ref="tableRef"
        class="fs-crud-table"
        v-bind="computedTable"
        :columns="table.columns"
        :loading="table.loading"
        :row-handle="rowHandle"
        :data="data"
        :cell-slots="computedCellSlots"
      />
    </template>

    <template #form>
      <div ref="innerWrapperRef" class="fs-form-wrapper-container" :class="{ 'fs-form-inner-wrapper': isFormInner }">
        <fs-form-wrapper
          ref="formWrapperRef"
          :slots="computedFormSlots"
          :inner-wrapper="innerWrapperRef"
          @inner-change="onFormInnerChange"
          @value-change="$emit('form-value-change', $event)"
        />
        <!-- 编辑对话框 -->
      </div>
    </template>

    <template #pagination>
      <div class="fs-crud-pagination">
        <div class="fs-pagination-left">
          <slot name="pagination-left"></slot>
        </div>
        <div class="fs-pagination">
          <!-- pagination.currentPage 如果为空， element会出警告 -->
          <component :is="ui.pagination.name" v-if="pagination.show !== false" v-bind="pagination" />
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
<script lang="ts">
import { computed, defineComponent, nextTick, onMounted, PropType, provide, ref, SetupContext, toRef } from "vue";
import { forEach } from "lodash-es";
import { uiContext } from "../ui";
import { useMerge } from "../use/use-merge";
import utilLog from "../utils/util.log";
import logger from "../utils/util.log";
import { RowSelectionProps, SetSearchFormDataProps } from "../d";
import { useUi } from "../use";
import { utils } from "../utils";

utils.trace("fs-table");
const { merge } = useMerge();

function useProviders(props: any, ctx: SetupContext) {
  provide("get:columns", () => {
    return props.table.columns;
  });
  provide("update:columns", (columns: any) => {
    ctx.emit("update:columns", columns);
  });

  provide("get:crudBinding", () => {
    return props;
  });
}

function useSearch(props: any, ctx: SetupContext) {
  const searchRef = ref();
  const getSearchRef = () => {
    return searchRef.value;
  };

  const getSearchFormData = () => {
    if (searchRef.value) {
      return searchRef.value.getForm();
    }
    logger.warn("请使用expose.getSearchFormData代替");
    return {};
  };

  const getSearchValidatedFormData = () => {
    if (searchRef.value) {
      return searchRef.value.getValidatedForm();
    }
    logger.warn("请使用expose.getSearchValidatedFormData代替");
    return {};
  };

  /**
   * 设置form值
   * @param form form对象
   * @param opts = {
   *    isMerge:false 是否与原有form值合并,
   * }
   */
  function setSearchFormData({ form, mergeForm = false }: SetSearchFormDataProps) {
    if (searchRef.value) {
      searchRef.value.setForm(form, mergeForm);
    }
  }

  return {
    searchRef,
    getSearchRef,
    getSearchFormData,
    setSearchFormData,
    getSearchValidatedFormData
  };
}

function useTabs(searchRet: any, props: any, ctx: SetupContext) {
  const tabsBinding = computed(() => {
    if (props.tabs && props.tabs.show && props.tabs.name) {
      let dict = null;
      const defaultTabs = { ...props.tabs };
      if (props.search?.columns && props.search?.columns[props.tabs.name]?.component?.dict) {
        dict = props.search?.columns[props.tabs.name]?.component?.dict;
        if (defaultTabs.value == null) {
          defaultTabs.value = dict.value;
        }
        if (defaultTabs.label == null) {
          defaultTabs.label = dict.label;
        }
        if (defaultTabs.options == null) {
          defaultTabs.options = dict.data || [];
        }
      }

      return {
        ...defaultTabs,
        modelValue: props.search.validatedForm && props.search.validatedForm[props.tabs.name],
        "onUpdate:modelValue": (value: any) => {
          ctx.emit("tab-change", { [props.tabs.name]: value });
        }
      };
    }
    return {
      show: false
    };
  });
  return {
    tabsBinding
  };
}

function slotFilter(ctxSlots: any, keyPrefix: string) {
  if (!ctxSlots) {
    return {};
  }
  const slots: any = {};
  forEach(ctxSlots, (value, key) => {
    if (key.startsWith(keyPrefix)) {
      slots[key] = value;
    }
  });
  return slots;
}

function useFixedHeight(props: any, ctx: SetupContext, { tableRef, containerRef }: any) {
  const ui = uiContext.get();
  let tableCI = ui.table;
  if (props.table?.tableVersion === "v2") {
    tableCI = ui.tableV2;
  }
  if (tableCI.hasMaxHeight(props.table)) {
    return {};
  }
  if (!tableCI.fixedHeaderNeedComputeBodyHeight) {
    return {};
  }
  const maxHeightRef = ref(null);

  function computeBodyHeight() {
    const tableDom = tableRef?.value?.$el;
    if (tableDom == null || tableDom.querySelector == null) {
      return;
    }
    const headDom = tableDom.querySelector(tableCI.headerDomSelector);
    if (headDom == null) {
      return;
    }
    const tableHeight = tableDom.getBoundingClientRect().height;
    const headHeight = headDom.getBoundingClientRect().height;
    maxHeightRef.value = tableHeight - headHeight - 2 + (props.table.maxHeightAdjust || 0);

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
        setTimeout(() => {
          computeBodyHeight();
        }, 200);
        setTimeout(() => {
          computeBodyHeight();
        }, 500);
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

function useTable(props: any, ctx: SetupContext) {
  const ui = uiContext.get();
  const tableRef = ref();
  const toolbarRef = ref();
  const containerRef = ref();
  const { maxHeightRef, computeBodyHeight } = useFixedHeight(props, ctx, { tableRef, containerRef });
  const { merge } = useMerge();
  const tablePropRef = toRef(props, "table");
  const computedTable = computed(() => {
    // antdv naive 高度自适应， 如果用户有配置scroll，则优先使用用户配置的
    let fixedHeight = {};
    if (maxHeightRef?.value != null) {
      let tableCI = ui.table;
      if (props.table?.tableVersion === "v2") {
        tableCI = ui.tableV2;
      }
      fixedHeight = tableCI.buildMaxHeight(maxHeightRef.value);
    }
    const pAttrs = utils.dash.omit(tablePropRef, "loading", "columns", "columnsMap");

    return merge(fixedHeight, { ...ctx.attrs, ...pAttrs });
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
    const clazz: any = { compact: props.toolbar.compact !== false };
    if (props.customClass) {
      clazz[props.customClass] = true;
    }
    return clazz;
  });

  const innerWrapperRef = ref();

  const isFormInner = ref(false);
  const onFormInnerChange = (value: any) => {
    isFormInner.value = value;
  };

  return {
    tableRef,
    containerRef,
    toolbarRef,
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
     * 表格id
     */
    id: {
      type: String,
      default: ""
    },
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
    // eslint-disable-next-line vue/require-default-prop
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
     * tabs filter
     */
    tabs: {
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
        return { show: false };
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
    },

    /**
     * 可选择
     */
    selection: {
      type: Object as PropType<RowSelectionProps>,
      default() {
        return { show: false };
      }
    }
  },
  emits: ["update:search", "update:compact", "update:columns", "form-value-change", "update:modelValue", "tab-change"],
  setup(props: any, ctx: any) {
    const { ui } = useUi();
    useProviders(props, ctx);
    const search = useSearch(props, ctx);
    const tabs = useTabs(search, props, ctx);
    const table = useTable(props, ctx);
    return {
      ui,
      ...search,
      ...table,
      ...tabs
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
      flex: 10000;
      align-items: center;
      min-width: 1px;
    }

    .fs-crud-toolbar {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      margin-right: 10px;
      flex: 1;
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

@media (max-width: 768px) {
  .fs-crud-container {
    .body {
      overflow-y: unset !important;
    }
    .ant-table-body {
      max-height: none !important;
      overflow: auto !important;
    }

    .n-data-table-base-table-body {
      max-height: none !important;
      overflow: auto !important;
    }

    .fs-crud-header .fs-crud-actionbar {
      flex: unset !important;
      flex-wrap: wrap;
      margin-bottom: 2px;
    }
  }
}
</style>
