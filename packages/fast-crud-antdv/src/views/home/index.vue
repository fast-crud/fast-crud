<template>
  <fs-crud class="home-page" ref="crudRef" v-bind="crudOptions">
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
import { useCrud, dict, utils } from "@fast-crud/fast-crud";
import createCrudOptions from "./crud";
import { notification } from "ant-design-vue";
export default defineComponent({
  setup() {
    utils.trace.trace("page-home");
    const crudRef = ref();
    const crud = useCrud({
      crudRef,
      options: createCrudOptions({ crudRef }),
    });

    onMounted(() => {
      crud.doRefresh();
    });

    const res = dict({});
    console.log("isReactive:", res, isReactive(res));

    const formBodyClick = (scope) => {
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
      ...crud,
      dateClick,
      crudRef,
      formBodyClick,
      closeDialog,
    };
  },
});
</script>
<style lang="less">
.search-form {
}
</style>
