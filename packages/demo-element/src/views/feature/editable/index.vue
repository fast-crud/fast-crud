<template>
  <fs-crud ref="crudRef" v-bind="crudBinding">
    <template #actionbar-right>
      <fs-button class="" @click="enable">启用编辑</fs-button>
      <fs-button class="ml-10" @click="disable">退出编辑</fs-button>
      <el-radio-group class="ml-10" v-model="crudBinding.table.editable.mode">
        <el-radio-button label="free">自由模式</el-radio-button>
        <el-radio-button label="row">行编辑模式</el-radio-button>
      </el-radio-group>
      <fs-button class="ml-10" @click="addRow">添加行</fs-button>
      <fs-button class="ml-10" @click="active">激活全部编辑</fs-button>

      <fs-button class="ml-10" @click="inactive">反激活全部</fs-button>
      <fs-button class="ml-10" @click="editCol">编辑列</fs-button>
      <fs-button class="ml-10" @click="cancel">取消/恢复原状</fs-button>
      <fs-button class="ml-10" @click="save">保存</fs-button>
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
      expose.editable.enable({ mode: "free" });
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
