<template>
  <div class="fs-editable-select">
    <div class="select">
      <fs-dict-select :value="modelValue" :dict="dict" v-bind="dictSelect" @update:value="doUpdate"></fs-dict-select>
    </div>

    <fs-table-select
      class="table-select"
      :model-value="modelValue"
      :dict="dict"
      :destroy-on-close="false"
      height="400px"
      v-bind="tableSelect"
      @update:model-value="doUpdate"
      @dialog-closed="doRefresh"
    >
      <template #default="scope">
        <fs-button type="primary" icon="ant-design:edit-outlined" v-bind="button" @click="scope.open"></fs-button>
      </template>
    </fs-table-select>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  /**
   * 值
   */
  modelValue?: number;
  /**
   * 数据字典
   */
  dict: any;
  /**
   * table-select参数
   */
  tableSelect: any;
  /**
   * dict-select参数
   */
  dictSelect?: any;
  /**
   * 按钮参数
   */
  button?: any;
}>();

defineOptions({
  /**
   * 可编辑选择器
   */
  name: "FsEditableSelect"
});

const emit = defineEmits([
  /**
   * 关闭对话框时触发
   */
  "refresh",
  "update:modelValue"
]);
function doRefresh() {
  emit("refresh");
  props.dict?.reloadDict();
}

function doUpdate(value: any) {
  emit("update:modelValue", value);
}
</script>

<style lang="less">
.fs-editable-select {
  display: flex;

  .select {
    flex: 1;
  }
  .table-select {
    flex: 0;
    margin-left: 5px;
  }
}
</style>
