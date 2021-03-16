<template>
  <fs-crud ref="crudRef" v-bind="crudOptions" />
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
import { useCrud } from "/src/fs";
import createCrudOptions from "./crud";
export default defineComponent({
  name: "CosUploader",
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
