<template>
  <fs-crud ref="crudRef" v-bind="crudBinding">
    <template #actionbar-right>
      <span class="ml-10">在表单的各个位置都可以插入自定义内容</span>
    </template>

    <template #form-header-left="scope">
      <el-tag type="danger" @click="logScope(scope)">form-header-left插槽</el-tag>
    </template>
    <template #form-header-right="scope">
      <el-tag type="danger" @click="logScope(scope)">form-header-right插槽</el-tag>
    </template>
    <template #form-header-action-left="scope">
      <el-tag type="danger" @click="logScope(scope)">form-header-action-left插槽</el-tag>
    </template>
    <template #form-header-action-right="scope">
      <el-tag type="danger" @click="logScope(scope)">form-header-action-right插槽</el-tag>
    </template>
    <template #form-body-top="scope">
      <el-alert type="warning" @click="logScope(scope)" title="form-body-top 插槽" />
    </template>
    <template #form-body-bottom="scope">
      <el-alert type="warning" @click="logScope(scope)" title="form-body-bottom 插槽" />
    </template>

    <template #form-footer-left="scope">
      <el-button type="danger" @click="logScope(scope)">form-footer-left 插槽</el-button>
    </template>
    <template #form-footer-right="scope">
      <el-button type="danger" @click="logScope(scope)">form-footer-right 插槽</el-button>
    </template>
  </fs-crud>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
import { useCrud, useExpose } from "/src/fs";
import createCrudOptions from "./crud";
export default defineComponent({
  name: "SlotsForm",
  setup() {
    // crud组件的ref
    const crudRef = ref();
    // crud 配置的ref
    const crudBinding = ref();
    // 暴露的方法
    const expose = useExpose({ crudRef, crudBinding });
    // 你的crud配置
    const { crudOptions } = createCrudOptions({ expose });
    // 初始化crud配置
    // eslint-disable-next-line @typescript-eslint/no-unused-vars,no-unused-vars
    const { resetCrudOptions } = useCrud({ expose, crudOptions });
    // 你可以调用此方法，重新初始化crud配置
    // resetCrudOptions(options)

    // 页面打开后获取列表数据
    onMounted(() => {
      expose.doRefresh();
    });

    return {
      crudBinding,
      crudRef,
      logScope(scope) {
        console.log("插槽", scope);
      }
    };
  }
});
</script>
