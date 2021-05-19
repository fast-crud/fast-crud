<template>
  <fs-crud ref="crudRef" v-bind="crudBinding">
    <template #actionbar-right>
      <fs-button class="ml-10" @click="addRow">添加行</fs-button>
    </template>
  </fs-crud>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
import createCrudOptions from "./crud";
import { useExpose, useCrud } from "@fast-crud/fast-crud";
import { ElMessage } from "element-plus";
export default defineComponent({
  name: "FeatureEditableRow",
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
      expose.editable.enable({ mode: "row" });
    });

    return {
      crudBinding,
      crudRef,
      enable() {
        expose.editable.enable({ enabled: true });
      },
      disable() {
        expose.editable.disable();
      },
      active() {
        expose.editable.active();
      },
      inactive() {
        expose.editable.inactive();
      },
      save() {
        expose.getTableRef().editable.submit(({ changed, removed, setData }) => {
          console.log("changed", changed);
          console.log("removed", removed);
          // setData({ 0: {id:1} }); //设置data
          ElMessage("保存,修改行：" + JSON.stringify(changed) + "；删除行：" + JSON.stringify(removed));
        });
      },
      cancel() {
        expose.editable.resume();
      },
      addRow() {
        expose.editable.addRow();
      },
      editCol() {
        expose.editable.editCol({ cols: ["radio"] });
      }
    };
  }
});
</script>
