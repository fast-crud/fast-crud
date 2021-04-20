<template>
  <fs-crud ref="crudRef" v-bind="crudBinding">
    <template #header-top>
      <div>
        <h3 style="margin-top: 0">部件显隐控制</h3>
        <a-row>
          <a-col :span="1"> 搜索框： </a-col>
          <a-col :span="1">
            <a-switch v-model:checked="crudBinding.search.show" active-color="#13ce66" inactive-color="#ff4949" />
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="1"> 动作条： </a-col>
          <a-col :span="1">
            <a-switch v-model:checked="crudBinding.actionbar.show" active-color="#13ce66" inactive-color="#ff4949" />
          </a-col>
          <a-col :span="2">
            添加：
            <a-switch
              v-model:checked="crudBinding.actionbar.buttons.add.show"
              active-color="#13ce66"
              inactive-color="#ff4949"
            />
          </a-col>
          <a-col :span="2">
            自定义：
            <a-switch
              v-model:checked="crudBinding.actionbar.buttons.test.show"
              active-color="#13ce66"
              inactive-color="#ff4949"
            />
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="1"> 工具条： </a-col>
          <a-col :span="1">
            <a-switch v-model:checked="crudBinding.toolbar.show" active-color="#13ce66" inactive-color="#ff4949" />
          </a-col>
          <a-col :span="2">
            查询：
            <a-switch
              v-model:checked="crudBinding.toolbar.buttons.search.show"
              active-color="#13ce66"
              inactive-color="#ff4949"
            />
          </a-col>
          <a-col :span="2">
            刷新：
            <a-switch
              v-model:checked="crudBinding.toolbar.buttons.refresh.show"
              active-color="#13ce66"
              inactive-color="#ff4949"
            />
          </a-col>
          <a-col :span="2">
            紧凑：
            <a-switch
              v-model:checked="crudBinding.toolbar.buttons.compact.show"
              active-color="#13ce66"
              inactive-color="#ff4949"
            />
          </a-col>
          <a-col :span="2">
            导出：
            <a-switch
              v-model:checked="crudBinding.toolbar.buttons.export.show"
              active-color="#13ce66"
              inactive-color="#ff4949"
            />
          </a-col>
          <a-col :span="2">
            列设置：
            <a-switch
              v-model:checked="crudBinding.toolbar.buttons.columns.show"
              active-color="#13ce66"
              inactive-color="#ff4949"
            />
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="1"> 表格： </a-col>
          <a-col :span="1">
            <a-switch v-model:checked="crudBinding.table.show" active-color="#13ce66" inactive-color="#ff4949" />
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="1"> 操作列： </a-col>
          <a-col :span="1">
            <a-switch v-model:checked="crudBinding.rowHandle.show" active-color="#13ce66" inactive-color="#ff4949" />
          </a-col>
          <a-col :span="2">
            查看：
            <a-switch
              v-model:checked="crudBinding.rowHandle.buttons.view.show"
              active-color="#13ce66"
              inactive-color="#ff4949"
            />
          </a-col>
          <a-col :span="2">
            修改：
            <a-switch
              v-model:checked="crudBinding.rowHandle.buttons.edit.show"
              active-color="#13ce66"
              inactive-color="#ff4949"
            />
          </a-col>
          <a-col :span="2">
            删除：
            <a-switch
              v-model:checked="crudBinding.rowHandle.buttons.remove.show"
              active-color="#13ce66"
              inactive-color="#ff4949"
            />
          </a-col>
          <a-col :span="2">
            自定义：
            <a-switch
              v-model:checked="crudBinding.rowHandle.buttons.custom.show"
              active-color="#13ce66"
              inactive-color="#ff4949"
            />
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="1"> 翻页： </a-col>
          <a-col :span="1">
            <a-switch v-model:checked="crudBinding.pagination.show" active-color="#13ce66" inactive-color="#ff4949" />
          </a-col>
        </a-row>
      </div>
    </template>
  </fs-crud>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
import { useCrud } from "/src/fs";
import createCrudOptions from "./crud";
import { useExpose } from "@fast-crud/fast-crud";

export default defineComponent({
  name: "FeatureHide",
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
      crudRef
    };
  }
});
</script>
