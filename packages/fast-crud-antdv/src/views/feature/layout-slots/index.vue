<template>
  <fs-crud ref="crudRef" v-bind="crudOptions">
    <template #header-top>
      <a-alert type="warning" message="header-top 插槽"
    /></template>
    <template #header-bottom
      ><a-alert type="warning" message="header-bottom 插槽"
    /></template>
    <template #header-middle>
      <a-alert type="warning" message="header-middle 插槽"
    /></template>
    <template #footer-top>
      <a-alert type="warning" message="footer-top 插槽"
    /></template>
    <template #footer-bottom>
      <a-alert type="warning" message="footer-bottom 插槽"
    /></template>

    <template #pagination-left>
      <a-button type="danger">pagination-left插槽</a-button>
    </template>
    <template #pagination-right>
      <a-button type="danger">pagination-right插槽</a-button>
    </template>

    <template #search-left>
      <a-button type="danger">search-left插槽</a-button>
    </template>
    <template #search-middle>
      <a-button type="danger">search-middle</a-button>
    </template>
    <template #search-right>
      <a-button type="danger">search-right插槽</a-button>
    </template>

    <template #actionbar-left>
      <a-button type="danger">actionbar-left插槽</a-button>
    </template>
    <template #actionbar-right>
      <a-button type="danger">actionbar-right插槽</a-button>
    </template>

    <template #toolbar-left>
      <a-button type="danger">toolbar-left插槽</a-button>
    </template>
    <template #toolbar-right>
      <a-button type="danger">toolbar-right插槽</a-button>
    </template>
  </fs-crud>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
import { useCrud } from "/src/fs";
import createCrudOptions from "./crud";
export default defineComponent({
  name: "LayoutSlots",
  setup() {
    // crud的ref
    const crudRef = ref();

    // useCrud
    const crud = useCrud({
      crudRef,
      options: createCrudOptions({ crudRef }),
    });

    // 获取列表数据
    onMounted(() => {
      crud.doRefresh();
    });

    return {
      ...crud,
      crudRef,
    };
  },
});
</script>
