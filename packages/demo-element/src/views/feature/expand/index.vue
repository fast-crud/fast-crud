<template>
  <fs-crud ref="crudRef" v-bind="crudBinding">
    <template #cell__expand="scope">index: {{ scope.$index }} ; row: {{ scope.row }} </template>
  </fs-crud>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
import createCrudOptions from "./crud";
import { useExpose, useCrud } from "@fast-crud/fast-crud";
import { ElMessage, ElMessageBox } from "element-plus";
import { BatchDelete } from "./api";
export default defineComponent({
  name: "FeatureExpand",
  setup() {
    // crud组件的ref
    const crudRef = ref();
    // crud 配置的ref
    const crudBinding = ref();
    // 暴露的方法
    const { expose } = useExpose({ crudRef, crudBinding });
    // 你的crud配置
    const { crudOptions, selectedIds } = createCrudOptions({ expose });
    // 初始化crud配置
    // eslint-disable-next-line @typescript-eslint/no-unused-vars,no-unused-vars
    const { resetCrudOptions } = useCrud({ expose, crudOptions });
    // 你可以调用此方法，重新初始化crud配置
    // resetCrudOptions(options)

    // 页面打开后获取列表数据
    onMounted(() => {
      expose.doRefresh();
    });

    const handleBatchDelete = () => {
      if (selectedIds.value?.length > 0) {
        ElMessageBox.confirm(`确定要批量删除这${selectedIds.value.length}条记录吗`, "确认").then(async () => {
          await BatchDelete(selectedIds.value);
          ElMessage.info("删除成功");
          expose.doRefresh();
          selectedIds.value = [];
        });
      } else {
        ElMessage.error("请先勾选记录");
      }
    };

    return {
      crudBinding,
      crudRef,
      handleBatchDelete
    };
  }
});
</script>
