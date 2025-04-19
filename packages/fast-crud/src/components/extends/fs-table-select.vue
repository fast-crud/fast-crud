<template>
  <div class="fs-table-select">
    <template v-if="!slots?.default && !viewMode">
      <fs-dict-select
        ref="dictSelectRef"
        v-bind="computedSelect"
        :open="false"
        :disabled="disabled"
        :readonly="readonly"
        :dict="dict"
        @click="openTableSelect"
      />
    </template>
    <slot v-bind="scopeRef"></slot>
    <component :is="ui.formItem.skipValidationWrapper">
      <component :is="ui.dialog.name" v-model:[ui.dialog.visible]="dialogOpen" v-bind="computedDialogBinding">
        <div v-if="dialogOpen || destroyOnClose === false" :style="{ width: '100%', height: height || '60vh' }">
          <fs-crud ref="crudRef" v-bind="crudBinding">
            <template #header-top>
              <div v-if="showCurrent !== false && !viewMode" class="fs-table-select-current">
                当前选中：
                <fs-values-format
                  ref="valuesFormatRef"
                  v-model="selectedRowKeys"
                  :dict="dict"
                  :closable="true"
                  v-bind="computedValuesFormat"
                ></fs-values-format>
              </div>
            </template>
          </fs-crud>
        </div>
        <template #[ui.dialog.footerSlotName]>
          <component :is="ui.button.name" v-if="!viewMode" @click="dialogOpen = false">取消</component>
          <component :is="ui.button.name" type="primary" @click="onOk">确认</component>
        </template>
      </component>
    </component>
  </div>
</template>
<script lang="tsx" setup>
import { Dict, useCompute, useFsAsync, useFsRef, useMerge, useUi } from "../../use";
import { computed, nextTick, ref, Ref, watch } from "vue";
import { CreateCrudOptions, DynamicallyCrudOptions } from "../../d";
import { useI18n } from "../../locale";

type FsTableSelectProps = {
  /**
   * modelValue
   */
  modelValue: any;
  /**
   * crudOptions创建方法
   */
  createCrudOptions: CreateCrudOptions;
  /**
   * crudOptions 覆盖配置
   */
  crudOptionsOverride?: DynamicallyCrudOptions;

  /**
   * 打开对话框前，可以修改配置
   * @param options
   */
  beforeOpen?: (options: {
    crudOptions: DynamicallyCrudOptions;
    selectedRowKeys: any;
    open: any;
    opened: any;
    [key: string]: any;
  }) => Promise<void>;
  /**
   * 数据字典
   * 必須配置`getNodesByValues`参数,你需要实现：根据id列表向后台请求多行数据并返回
   * `dict.value必须与table.rowKey一致`
   */
  dict: Dict;
  /**
   * 选择框 fs-dict-select配置
   */
  select?: any;

  /**
   * 是否显示选择框
   * 有时候你只是想要那个选择的Dialog，那么你可以隐藏select，然后自定义激活方式
   */
  showSelect?: boolean;
  /**
   * 对话框配置
   */
  dialog?: any;

  /**
   * 对话框中是否显示当前选中值
   */
  showCurrent?: boolean;
  /**
   * 当前选中值 fs-values-format组件 配置
   */
  valuesFormat?: any;

  /**
   * crud高度
   */
  height?: string;
  /**
   * 是否多选
   */
  multiple?: boolean; //单选还是多选
  /**
   * 跨页选中
   */
  crossPage?: boolean; //跨页选中

  /**
   * 可选,element-plus必传
   */
  rowKey?: string;

  disabled?: boolean;

  readonly?: boolean;

  /**
   * 值类型
   */
  valueType?: "value" | "object";

  /**
   * 是否查看模式
   */
  viewMode?: boolean;
  /**
   * 查看模式下是否触发change事件
   */
  emitOnViewModel?: boolean;

  /**
   * table是否跟随窗口关闭而销毁
   */
  destroyOnClose?: boolean;
};
const props = withDefaults(defineProps<FsTableSelectProps>(), {
  crossPage: true,
  rowKey: undefined,
  disabled: false,
  readonly: false,
  height: undefined,
  valuesFormat: undefined,
  dialog: undefined,
  select: undefined,
  crudOptionsOverride: undefined,
  valueType: "value",
  showSelect: true,
  showCurrent: true,
  viewMode: false,
  emitOnViewModel: true,
  destroyOnClose: true
});

const slots = defineSlots<{
  /**`
   * 默认插槽
   * ```js
   * scope = {
   *  //是否已打开
   *  opened:boolean,
   *  //打开方法
   *  open:()=>void
   * }
   * ```
   */
  default: any;
}>();

const emits = defineEmits([
  "change",
  "update:modelValue",
  /* 选中行变化事件 */
  "selected-change",
  /*对话框即将关闭*/
  "dialog-close",
  /*对话框已关闭*/
  "dialog-closed"
]);
const { ui } = useUi();
const { t } = useI18n();
const dictSelectRef = ref();
const valuesFormatRef = ref();
const dialogOpen = ref(false);

const { crudRef, crudBinding, crudExpose } = useFsRef();

function initSelectedKeys(modelValue: any) {
  if (modelValue == null || (Array.isArray(modelValue) && modelValue.length == 0)) {
    selectedRowKeys.value = [];
  } else {
    if (props.multiple) {
      selectedRowKeys.value = modelValue || [];
    } else {
      selectedRowKeys.value = [modelValue];
    }
    if (props.valueType === "object") {
      selectedRowKeys.value = selectedRowKeys.value.map((item) => {
        return props.dict.getValue(item);
      });
    }
  }
}

const openTableSelect = async (openOptions: { crudOptions: DynamicallyCrudOptions; context: any }) => {
  if (props.disabled || props.readonly || props.select?.disabled || props.select?.readonly) {
    return;
  }
  if (props.dict == null) {
    throw new Error("必须配置dict，且必须配置dict.getNodesByValues");
  }

  const ret = await useFsAsync({
    crudBinding,
    crudRef,
    createCrudOptions: props.createCrudOptions,
    crudOptionsOverride: buildMergedCrudOptions(),
    context: openOptions.context,
    crudExpose
  });

  initSelectedKeys(props.modelValue);
  if (props.beforeOpen) {
    await props.beforeOpen({
      crudOptions: openOptions.crudOptions,
      ...getScopeContext()
    });
  }
  if (openOptions) {
    ret.appendCrudOptions(openOptions.crudOptions);
  }
  dialogOpen.value = true;
  await crudExpose.doRefresh();
  return ret;
};

const computedValuesFormat = computed(() => {
  return {
    ...props.valuesFormat
  };
});

const computedSelect = computed(() => {
  const updateKey = `onUpdate:${ui.select.modelValue}`;

  let value = props.modelValue;
  if (props.valueType === "object" && props.modelValue) {
    if (props.multiple) {
      value = props.modelValue.map((item: any) => {
        return props.dict.getValue(item);
      });
    } else {
      value = props.dict.getValue(props.modelValue);
    }
  }
  return {
    [ui.select.modelValue]: value,
    [updateKey]: (value: any) => {
      emits("update:modelValue", value);
    },
    [ui.select.clearable]: true,
    ...ui.select.buildMultiBinding(props.multiple),
    show: false,
    ...props.select
  };
});

const computedDialogBinding = computed(() => {
  const base = ui.dialog.buildProps({
    title: props.viewMode ? t("fs.extends.tableSelect.view") : t("fs.extends.tableSelect.select"),
    width: "80%"
  });
  return merge(base, props.dialog);
});

watch(
  () => {
    return props.modelValue;
  },
  async (value) => {
    if (value === selectedRowKeys.value) {
      return;
    }
    initSelectedKeys(value);
    await nextTick();
    await props.dict.appendByValues(selectedRowKeys.value);
    // dictSelectRef.value.reloadDict();
  }
);
const selectedRowKeys: Ref<any[]> = ref([]);

function getRowKey() {
  return props.rowKey || crudBinding.value.table.rowKey || "id";
}
const refreshing = ref(false);

function buildMergedCrudOptions() {
  let tableCI = ui.table;
  if (crudBinding.value?.table?.tableVersion === "v2") {
    tableCI = ui.tableV2;
  }
  let selectionOptions = tableCI.buildSelectionCrudOptions({
    crossPage: props.crossPage,
    selectOnClickRow: true,
    getRowKey,
    getPageData() {
      return crudBinding.value.data;
    },
    useCompute: useCompute,
    multiple: props.multiple,
    selectedRowKeys,
    onSelectedKeysChanged: async (changed) => {
      selectedRowKeys.value = [...changed];
      await nextTick();
      await props.dict.appendByValues(selectedRowKeys.value);
      // if (valuesFormatRef.value) {
      //   valuesFormatRef.value.reloadDict();
      // }
    }
  });
  const crudOptions = {
    table: {
      async onRefreshed() {
        if (tableCI.setSelectedRows) {
          refreshing.value = true;
          await nextTick();
          await nextTick();
          const baseTableRef = crudExpose.getBaseTableRef();
          tableCI.setSelectedRows({
            getRowKey,
            multiple: props.multiple,
            tableRef: baseTableRef,
            selectedRowKeys
          });
          refreshing.value = false;
        }
      }
    }
  };
  return merge(crudOptions, selectionOptions, props.crudOptionsOverride);
}

const { merge } = useMerge();

// watch(
//   () => {
//     return props.crudOptionsOverride;
//   },
//   async (value, oldValue) => {
//     if (JSON.stringify(value) === JSON.stringify(oldValue)) {
//       return;
//     }
//     const cur = crudBinding.value?.pagination[ui.pagination.currentPage];
//     appendCrudOptions(value);
//     if (crudRef.value) {
//       crudBinding.value.pagination[ui.pagination.currentPage] = cur;
//       await crudExpose.doRefresh({ goFirstPage: false });
//     }
//   }
// );

async function onOk() {
  if (props.dict.loading) {
    return;
  }
  let value = null;
  let rows = null;
  if (selectedRowKeys.value?.length > 0) {
    value = [...selectedRowKeys.value];

    rows = value.map((item) => {
      return props.dict.getDictMap()[item];
    });
    if (props.valueType === "object") {
      value = rows;
    }

    if (props.multiple !== true && value.length > 0) {
      value = value[0];
    }
  }

  if (!props.viewMode || props.emitOnViewModel) {
    //非view模式下，需要更新value
    emits("update:modelValue", value);
    emits("change", value);
    emits("selected-change", rows);
  }
  dialogOpen.value = false;

  let scope = {
    value,
    rows,
    selectedRowKeys: selectedRowKeys.value
  };
  emits("dialog-close", scope);
  await nextTick();
  emits("dialog-closed", scope);
}

const getScopeContext = () => {
  return {
    opened: dialogOpen,
    open: openTableSelect,
    selectedRowKeys,
    dictSelectRef,
    valuesFormatRef,
    crudRef,
    crudBinding,
    crudExpose
  };
};

const scopeRef = ref(getScopeContext());
defineExpose(scopeRef.value);
</script>
<style lang="less">
.fs-table-select {
  width: 100%;
  .el-dialog__body {
    padding-top: 0;
    padding-bottom: 0;
  }
}
.fs-table-select-current {
  //border: 1px solid #eee;
  //border-radius: 3px;
  padding: 10px 0;
}
</style>
