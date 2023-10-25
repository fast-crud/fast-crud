<template>
  <div class="fs-table-select">
    <fs-dict-select
      ref="dictSelectRef"
      :dict="dict"
      :disabled="disabled"
      :readonly="readonly"
      v-bind="computedSelect"
      :open="false"
      @click="openTableSelect"
    />
    <component :is="ui.formItem.skipValidationWrapper">
      <component :is="ui.dialog.name" v-model:[ui.dialog.visible]="dialogOpen" v-bind="computedDialogBinding">
        <div :style="{ width: '100%', height: height || '60vh' }">
          <fs-crud ref="crudRef" v-bind="crudBinding">
            <template #header-top>
              <div class="fs-table-select-current">
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
          <component :is="ui.button.name" @click="dialogOpen = false">取消</component>
          <component :is="ui.button.name" type="primary" @click="onOk">确认</component>
        </template>
      </component>
    </component>
  </div>
</template>
<script lang="tsx" setup>
import { CreateCrudOptions, Dict, useFs, useMerge, useUi } from "../../use";
import { computed, nextTick, ref, Ref, watch } from "vue";
import { DynamicallyCrudOptions } from "../../d";
import _ from "lodash-es";
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
   * 数据字典, 必須配置getNodesByValues参数
   */
  dict: Dict;
  /**
   * 选择框 fs-dict-select配置
   */
  select?: any;

  /**
   * 对话框配置
   */
  dialog?: any;

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
   * 可选
   */
  rowKey?: string;

  disabled?: boolean;

  readonly?: boolean;

  /**
   * 值类型
   */
  valueType?: "value" | "object";
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
  valueType: "value"
});
const emits = defineEmits(["change", "update:modelValue"]);
const { ui } = useUi();
const dictSelectRef = ref();
const valuesFormatRef = ref();
const dialogOpen = ref(false);
const openTableSelect = async () => {
  if (props.disabled || props.readonly || props.select?.disabled || props.select?.readonly) {
    return;
  }
  if (props.dict == null) {
    throw new Error("必须配置dict，且必须配置dict.getNodesByValues");
  }
  dialogOpen.value = true;
  if (props.modelValue == null || (Array.isArray(props.modelValue) && props.modelValue.length == 0)) {
    selectedRowKeys.value = [];
  } else {
    if (props.multiple) {
      selectedRowKeys.value = props.modelValue || [];
    } else {
      selectedRowKeys.value = [props.modelValue];
    }
    if (props.valueType === "object") {
      selectedRowKeys.value = selectedRowKeys.value.map((item) => {
        return props.dict.getValue(item);
      });
    }
  }
  await crudExpose.doRefresh();
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
    title: "选择",
    width: "80%"
  });
  return _.merge(base, props.dialog);
});

watch(
  () => {
    return props.modelValue;
  },
  async (value) => {
    if (value === selectedRowKeys.value) {
      return;
    }
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
  let selectionOptions = ui.table.buildSelectionBinding({
    crossPage: props.crossPage,
    getRowKey,
    getPageData() {
      return crudBinding.value.data;
    },
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
const { crudBinding, crudRef, crudExpose, context, appendCrudOptions, crudOptions } = useFs({
  createCrudOptions: props.createCrudOptions,
  crudOptionsOverride: override.value
});

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
  let value = null;
  if (selectedRowKeys.value?.length > 0) {
    value = [...selectedRowKeys.value];

    if (props.valueType === "object") {
      value = value.map((item) => {
        return props.dict.getDictMap()[item];
      });
    }

    if (props.multiple !== true) {
      value = value[0];
    }
  }

  emits("update:modelValue", value);
  emits("change", value);
  dialogOpen.value = false;
}
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
