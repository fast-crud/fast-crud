<template>
  <div>
    <fs-dict-select
      ref="dictSelectRef"
      :dict="dict"
      :[ui.select.modelValue]="modelValue"
      v-bind="select"
      :open="false"
      mode="multiple"
      @click="openTableSelect"
    />
    <component :is="ui.formItem.skipValidationWrapper">
      <component
        :is="ui.dialog.name"
        v-model:[ui.dialog.visible]="dialogOpen"
        v-bind="
          ui.dialog.buildProps({
            props: {
              title: '选择',
              width: '80%',
              onOk: onOk
            }
          })
        "
      >
        <div style="width: 100%; height: 60vh">
          <fs-crud ref="crudRef" v-bind="crudBinding">
            <template #header-top>
              <div class="fs-table-select-current">
                当前选中：
                <fs-values-format ref="valuesFormatRef" :model-value="selectedRowKeys" :dict="dict"></fs-values-format>
              </div>
            </template>
          </fs-crud>
        </div>
      </component>
    </component>
  </div>
</template>
<script lang="ts" setup>
import { CreateCrudOptions, Dict, useFs, useMerge, useUi } from "../../use";
import { computed, nextTick, ref, watch, Ref } from "vue";
import { DynamicallyCrudOptions } from "../../d";

// defineOptions({
//   name: "FsTableSelect"
// });
type FsTableSelectProps = {
  /**
   * modelValue
   */
  modelValue: any;
  /**
   * crudOptionsCreator
   */
  createCrudOptions: CreateCrudOptions;
  crudOptionsOverride: DynamicallyCrudOptions;
  dict: Dict;
  select?: any;
  multiple?: boolean; //单选还是多选
  crossPage?: boolean; //跨页选中
};
const props = defineProps<FsTableSelectProps>();
const emits = defineEmits(["change", "update:modelValue"]);
const { ui } = useUi();
const dictSelectRef = ref();
const valuesFormatRef = ref();
const dialogOpen = ref(false);
const openTableSelect = () => {
  dialogOpen.value = true;
  crudExpose.doRefresh();
  if (props.modelValue) {
    if (props.multiple) {
      selectedRowKeys.value = props.modelValue || [];
    } else {
      selectedRowKeys.value = [props.modelValue];
    }
  } else {
    selectedRowKeys.value = [];
  }
};

watch(
  () => {
    return props.modelValue;
  },
  async (value) => {
    if (value === selectedRowKeys.value) {
      return;
    }
    await nextTick();
    dictSelectRef.value.reloadDict();
  }
);
const selectedRowKeys: Ref<any[]> = ref([]);

const override: DynamicallyCrudOptions = computed(() => {
  let selection = ui.table.buildSelectionBinding({
    multiple: props.multiple,
    selectedRowKeys,
    crossPage: props.crossPage,
    onChanged: async (keys) => {
      selectedRowKeys.value = [...keys];
      await nextTick();
      if (valuesFormatRef.value) {
        valuesFormatRef.value.reloadDict();
      }
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
    return override.value;
  },
  (value) => {
    appendCrudOptions(value);
  }
);

function onOk() {
  if (selectedRowKeys.value?.length > 0) {
    let value = [...selectedRowKeys.value];
    if (!props.multiple) {
      value = value[0];
    }
    emits("update:modelValue", value);
    emits("change", value);
  }
  dialogOpen.value = false;
}
</script>

<style lang="less">
.fs-table-select-current {
  //border: 1px solid #eee;
  //border-radius: 3px;
  padding: 10px 0;
}
</style>
