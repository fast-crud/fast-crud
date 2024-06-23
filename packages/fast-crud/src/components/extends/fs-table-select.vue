<template>
  <div class="fs-table-select">
    <template v-if="!slots?.default && !viewMode">
      <fs-dict-select
        ref="dictSelectRef"
        :dict="dict"
        :disabled="disabled"
        :readonly="readonly"
        v-bind="computedSelect"
        :open="false"
        @click="openTableSelect"
      />
    </template>
    <slot v-bind="scopeRef"></slot>
    <component :is="ui.formItem.skipValidationWrapper">
      <component :is="ui.dialog.name" v-model:[ui.dialog.visible]="dialogOpen" v-bind="computedDialogBinding">
        <div :style="{ width: '100%', height: height || '60vh' }">
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
import { Dict, useCompute, useFs, useMerge, useUi } from "../../use";
import { computed, nextTick, ref, Ref, watch } from "vue";
import { CreateCrudOptions, DynamicallyCrudOptions } from "../../d";
import _ from "lodash-es";
import { useI18n } from "../../locale";
// defineOptions({
//   name: "FsTableSelect"
// });
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
  viewMode: false
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
  "selected-change"
]);
const { ui } = useUi();
const { t } = useI18n();
const dictSelectRef = ref();
const valuesFormatRef = ref();
const dialogOpen = ref(false);

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
const openTableSelect = async (openOptions: { crudOptions: CreateCrudOptions }) => {
  if (props.disabled || props.readonly || props.select?.disabled || props.select?.readonly) {
    return;
  }
  if (props.dict == null) {
    throw new Error("必须配置dict，且必须配置dict.getNodesByValues");
  }
  dialogOpen.value = true;
  initSelectedKeys(props.modelValue);
  ret.appendCrudOptions(openOptions.crudOptions);
  await nextTick();
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

const override: DynamicallyCrudOptions = computed(() => {
  let selectionOptions = ui.table.buildSelectionCrudOptions({
    crossPage: props.crossPage,
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
        if (ui.table.setSelectedRows) {
          refreshing.value = true;
          await nextTick();
          await nextTick();
          ui.table.setSelectedRows({
            getRowKey,
            multiple: props.multiple,
            tableRef: crudExpose.getBaseTableRef(),
            selectedRowKeys
          });
          refreshing.value = false;
        }
      }
    }
  };
  return merge(crudOptions, selectionOptions, props.crudOptionsOverride);
});

const { merge } = useMerge();
// eslint-disable-next-line vue/no-setup-props-destructure
const ret = useFs({
  createCrudOptions: props.createCrudOptions,
  crudOptionsOverride: override.value
});
const { crudExpose, context, appendCrudOptions, crudOptions, crudBinding, crudRef } = ret;

watch(
  () => {
    return props.crudOptionsOverride;
  },
  async (value, oldValue) => {
    if (JSON.stringify(value) === JSON.stringify(oldValue)) {
      return;
    }
    const cur = crudBinding.value?.pagination[ui.pagination.currentPage];
    appendCrudOptions(value);
    if (crudRef.value) {
      crudBinding.value.pagination[ui.pagination.currentPage] = cur;
      await crudExpose.doRefresh({ goFirstPage: false });
    }
  }
);

function onOk() {
  if (props.dict.loading) {
    return;
  }
  if (!props.viewMode) {
    //非view模式下，需要更新value
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

    emits("update:modelValue", value);
    emits("change", value);
    emits("selected-change", rows);
  }
  dialogOpen.value = false;
}

const getScopeContext = () => {
  return {
    opened: dialogOpen,
    open: openTableSelect
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
