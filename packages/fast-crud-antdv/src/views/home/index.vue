<template>
  <fs-crud class="home-page" ref="crudRef" v-bind="crudBinding">
    <template #cell-date="scope">
      <a-button @click="dateClick('date', scope)"
        >cell- date,{{ scope.row.date }}</a-button
      >
    </template>

    <template #form-date="scope">
      <a-button @click="dateClick('date', scope)"
        >form- date,{{ scope.row.date }}</a-button
      >
    </template>

    <template #form-body-before="scope">
      <a-button @click="formBodyClick(scope)">form-body-before</a-button>
    </template>

    <template #form-footer-prefix="scope">
      <a-button @click="closeDialog(scope)">自定义取消</a-button>
    </template>

    <template #form-footer-append="scope">
      <a-button @click="formBodyClick(scope)">form-footer-append</a-button>
    </template>

    <template #pagination-prefix>
      <a-button type="primary">批量删除</a-button>
    </template>
    <template #pagination-append>
      <a-button><SearchOutlined />批量删除</a-button>
    </template>
  </fs-crud>
</template>

<script>
import { defineComponent, ref, onMounted, isReactive } from "vue";
import { useCrud, dict, utils, useExpose } from "@fast-crud/fast-crud";
import createCrudOptions from "./crud";
import { notification } from "ant-design-vue";
export default defineComponent({
  setup() {
    utils.trace.trace("page-home");
    // crud组件的ref
    const crudRef = ref();
    // crud 配置的ref
    const crudBinding = ref();
    // 暴露的方法
    const expose = useExpose({ crudRef, crudBinding });
    // 你的crud配置
    const crudOptions = createCrudOptions({ expose });
    // 初始化crud配置
    // eslint-disable-next-line @typescript-eslint/no-unused-vars,no-unused-vars
    const { resetCrudOptions } = useCrud({ expose, crudOptions });
    // 你可以调用此方法，重新初始化crud配置
    // resetCrudOptions(options)

    // 页面打开后获取列表数据
    onMounted(() => {
      expose.doRefresh();
    });

    const res = dict({});
    console.log("isReactive:", res, isReactive(res));

    const formBodyClick = scope => {
      console.log("scope", scope);
      notification.success("mode:" + scope.mode);
    };

    const dateClick = (key, scope) => {
      console.log("dateClick", scope);
      notification.success(scope.row[key]);
    };

    function closeDialog(scope) {
      scope._self.close();
    }

    // onRenderTracked((event) => {
    //   console.log('状态跟踪组件----------->', event.key, event)
    // })
    // onRenderTriggered((event) => {
    //   console.log('状态触发组件--------------->', event.key, event)
    // })
    return {
      crudBinding,
      crudRef,
      dateClick,
      formBodyClick,
      closeDialog
    };
  }
});
</script>
<style lang="less">
.search-form {
}
</style>
