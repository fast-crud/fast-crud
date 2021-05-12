<template>
  <fs-crud ref="crudRef" v-bind="crudBinding">
    <template #actionbar-right>
      <fs-button class="ml-10" @click="quit">退出编辑</fs-button>
      <fs-button class="ml-10" @click="save">保存</fs-button>
      <fs-button class="ml-10" @click="cancel">取消</fs-button>
    </template>
  </fs-crud>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
import createCrudOptions from "./crud";
import { useExpose, useCrud } from "@fast-crud/fast-crud";
import { ElMessage } from "element-plus";
export default defineComponent({
  name: "FeatureEditable",
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
      expose.editable.editAll();
    });

    return {
      crudBinding,
      crudRef,
      quit() {
        expose.editable.quit();
      },
      save() {
        expose.getTableRef().editable.submit((changed) => {
          console.log("changed", changed);
          ElMessage("保存修改：" + JSON.stringify(changed));
        });
      },
      cancel() {
        expose.getTableRef().editable.resume();
      }
    };
  }
});
</script>
