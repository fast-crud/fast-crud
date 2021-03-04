<template>
  <fs-crud customClass="page-layout" ref="crudRef" v-bind="crudOptions">
    <template #header-top>
      <div class="page-header">表单布局</div>
    </template>
  </fs-crud>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
import { useCrud } from "/src/fs";
import createCrudOptions from "./crud";
export default defineComponent({
  name: "FormLayoutFlex",
  setup() {
    const crudRef = ref();
    const crud = useCrud({
      crudRef,
      options: createCrudOptions({ crudRef }),
    });

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
