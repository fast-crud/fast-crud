<template>
  <fs-container ref="containerRef" v-bind="container" class="fs-crud-container fs-crud-table" :class="computedClass">
    <template #header>
      <div class="fs-crud-header">
        <div class="fs-header-top">
          <slot name="header-top"></slot>
        </div>
        <div class="fs-header-middle">
          <slot name="header-middle"></slot>
        </div>

        <div v-if="actionbar && actionbar.show !== false" class="fs-crud-actionbar">
          <slot name="actionbar-left"></slot>
          <fs-actionbar v-bind="actionbar" />
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
      :row-handle="rowHandle"
      :data="data"
      :cell-slots="computedCellSlots"
    />

    <template #box>
      <div ref="innerWrapperRef" class="fs-form-wrapper-container" :class="{ 'fs-form-inner-wrapper': isFormInner }">
        <!-- 编辑对话框 -->
        <fs-form-wrapper
          ref="formWrapperRef"
          :slots="computedFormSlots"
          :inner-wrapper="innerWrapperRef"
          :submit="submit"
          @inner-change="onFormInnerChange"
          @value-change="$emit('form-value-change', $event)"
        />
      </div>
    </template>
  </fs-container>
</template>
<script>
import { defineComponent, computed, provide, ref, toRef, nextTick, onMounted, watch } from "vue";
import _ from "lodash-es";
import traceUtil from "../utils/util.trace";
import { uiContext } from "../ui";
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
    return { ...fixedHeight, ...ctx.attrs, ...props.table };
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
    customClass: {},
    /**
     * 不要传到fs-table去
     */
    form: {},

    modelValue: {
      type: Array
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
    useProviders();
    const table = useTable(props, ctx);
    const submit = computed(() => {
      if (props.modelValue) {
        return function ({ formRef, close }) {
          const newData = [...props.modelValue];

          if (formRef.value.mode === "add") {
            newData.push({ ...formRef.value.form });
          } else if (formRef.value.mode === "edit") {
            newData[formRef.value.index] = { ...newData[formRef.value.index], ...formRef.value.form };
          }
          close();
          ctx.emit("update:modelValue", newData);
          nextTick(() => {
            ctx.emit("refresh");
          });
        };
      }
      return undefined;
    });
    watch(
      computed(() => props.modelValue),
      () => {
        ctx.emit("refresh");
      }
    );
    return {
      ...table,
      submit
    };
  }
});
</script>
<style lang="less">
.fs-crud-table {
  .fs-crud-header,
  .fs-crud-container.compact .fs-crud-footer {
    padding: 0 !important;
  }
  min-height: 0;

  .box .inner {
    position: static;
  }
}
</style>
