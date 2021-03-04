<template>
  <fs-crud ref="crudRef" v-bind="crudOptions" >
    <template #header-insert></template>
  </fs-crud>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
import { useCrud } from "/src/fs";
import createCrudOptions from "./crud";
export default defineComponent({
  name: "FormLayout",
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
<style lang="less">

</style>
