<template>
  <div class="fs-table-select">
    <fs-dict-select ref="dictSelectRef" :dict="dict" v-bind="computedSelect" :open="false" @click="openTableSelect" />
    <component :is="ui.formItem.skipValidationWrapper">
      <component :is="ui.dialog.name" v-model:[ui.dialog.visible]="dialogOpen" v-bind="computedDialogBinding">
        <div :style="{ width: '100%', height: height || '60vh' }">
          <fs-crud ref="crudRef" v-bind="crudBinding">
            <template #header-top>
              <div class="fs-table-select-current">
                当前选中：
                <fs-values-format ref="valuesFormatRef" :model-value="selectedRowKeys" :dict="dict"></fs-values-format>
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
   * 选择框配置
   */
  select?: any;
  /**
   * 对话框配置
   */
  dialog?: any;

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
   * element plus 必传
   */
  rowKey?: string;
};
const props = defineProps<FsTableSelectProps>();
const emits = defineEmits(["change", "update:modelValue"]);
const { ui } = useUi();
const dictSelectRef = ref();
const valuesFormatRef = ref();
const dialogOpen = ref(false);
const openTableSelect = async () => {
  dialogOpen.value = true;
  if (props.modelValue == null || (Array.isArray(props.modelValue) && props.modelValue.length == 0)) {
    selectedRowKeys.value = [];
  } else {
    if (props.multiple) {
      selectedRowKeys.value = props.modelValue || [];
    } else {
      selectedRowKeys.value = [props.modelValue];
    }
  }
  await crudExpose.doRefresh();
};

const computedSelect = computed(() => {
  const updateKey = `onUpdate:${ui.select.modelValue}`;
  return {
    ...props.select,
    [ui.select.modelValue]: props.modelValue,
    [updateKey]: (value: any) => {
      emits("update:modelValue", value);
    },
    [ui.select.clearable]: true,
    ...ui.select.buildMultiBinding(props.multiple),
    show: false
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

const override: DynamicallyCrudOptions = computed(() => {
  let selection = ui.table.buildSelectionBinding({
    rowKey: props.rowKey,
    multiple: props.multiple,
    selectedRowKeys,
    crossPage: props.crossPage,
    onChanged: async (keys) => {
      selectedRowKeys.value = [...keys];
      await nextTick();
      await props.dict.appendByValues(selectedRowKeys.value);
      // if (valuesFormatRef.value) {
      //   valuesFormatRef.value.reloadDict();
      // }
    }
  });
  const crudOptions = { ...selection };
  return merge(crudOptions, props.crudOptionsOverride);
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
      await nextTick();
      await nextTick();
      crudBinding.value.pagination[ui.pagination.currentPage] = cur;
      await crudExpose.doRefresh({ goFirstPage: false });
    }
  }
);

function onOk() {
  let value = null;
  if (selectedRowKeys.value?.length > 0) {
    value = [...selectedRowKeys.value];
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
