<template>
  <fs-crud ref="crudRef" v-bind="crudBinding">
    <template #header-top>
      <el-card header="部件显隐控制" style="margin-bottom: 20px">
        <div style="max-width: 900px">
          <el-row>
            <el-col :span="2"> 搜索框： </el-col>
            <el-col :span="2">
              <el-switch v-model="crudBinding.search.show" active-color="#13ce66" inactive-color="#ff4949" />
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="2"> 动作条： </el-col>
            <el-col :span="2">
              <el-switch v-model="crudBinding.actionbar.show" active-color="#13ce66" inactive-color="#ff4949" />
            </el-col>
            <el-col :span="3">
              添加：
              <el-switch
                v-model="crudBinding.actionbar.buttons.add.show"
                active-color="#13ce66"
                inactive-color="#ff4949"
              />
            </el-col>
            <el-col :span="3">
              自定义：
              <el-switch
                v-model="crudBinding.actionbar.buttons.test.show"
                active-color="#13ce66"
                inactive-color="#ff4949"
              />
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="2"> 工具条： </el-col>
            <el-col :span="2">
              <el-switch v-model="crudBinding.toolbar.show" active-color="#13ce66" inactive-color="#ff4949" />
            </el-col>
            <el-col :span="3">
              查询：
              <el-switch
                v-model="crudBinding.toolbar.buttons.search.show"
                active-color="#13ce66"
                inactive-color="#ff4949"
              />
            </el-col>
            <el-col :span="3">
              刷新：
              <el-switch
                v-model="crudBinding.toolbar.buttons.refresh.show"
                active-color="#13ce66"
                inactive-color="#ff4949"
              />
            </el-col>
            <el-col :span="3">
              紧凑：
              <el-switch
                v-model="crudBinding.toolbar.buttons.compact.show"
                active-color="#13ce66"
                inactive-color="#ff4949"
              />
            </el-col>
            <el-col :span="3">
              导出：
              <el-switch
                v-model="crudBinding.toolbar.buttons.export.show"
                active-color="#13ce66"
                inactive-color="#ff4949"
              />
            </el-col>
            <el-col :span="3">
              列设置：
              <el-switch
                v-model="crudBinding.toolbar.buttons.columns.show"
                active-color="#13ce66"
                inactive-color="#ff4949"
              />
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="2"> 表格： </el-col>
            <el-col :span="2">
              <el-switch v-model="crudBinding.table.show" active-color="#13ce66" inactive-color="#ff4949" />
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="2"> 操作列： </el-col>
            <el-col :span="2">
              <el-switch v-model="crudBinding.rowHandle.show" active-color="#13ce66" inactive-color="#ff4949" />
            </el-col>
            <el-col :span="3">
              查看：
              <el-switch
                v-model="crudBinding.rowHandle.buttons.view.show"
                active-color="#13ce66"
                inactive-color="#ff4949"
              />
            </el-col>
            <el-col :span="3">
              修改：
              <el-switch
                v-model="crudBinding.rowHandle.buttons.edit.show"
                active-color="#13ce66"
                inactive-color="#ff4949"
              />
            </el-col>
            <el-col :span="3">
              删除：
              <el-switch
                v-model="crudBinding.rowHandle.buttons.remove.show"
                active-color="#13ce66"
                inactive-color="#ff4949"
              />
            </el-col>
            <el-col :span="3">
              自定义：
              <el-switch
                v-model="crudBinding.rowHandle.buttons.custom.show"
                active-color="#13ce66"
                inactive-color="#ff4949"
              />
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="2"> 翻页： </el-col>
            <el-col :span="2">
              <el-switch v-model="crudBinding.pagination.show" active-color="#13ce66" inactive-color="#ff4949" />
            </el-col>
          </el-row>
        </div>
      </el-card>
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
