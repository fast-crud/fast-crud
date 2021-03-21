<template>
  <fs-crud ref="crudRef" v-bind="crudOptions" />
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
import { useCrud } from "/src/fs";
import createCrudOptions from "./crud";
export default defineComponent({
  name: "FormDict",
  setup() {
    // crud的ref
    const crudRef = ref();

    // useCrud
    const options = createCrudOptions({ crudRef });
    const crud = useCrud({
      crudRef,
      options
    });

    const remoteDict = options.remoteDict;
    console.log(
      "init after",
      crud.crudOptions.value.table.columns[2].component.dict === remoteDict
    );
    // 获取列表数据
    onMounted(() => {
      crud.doRefresh();
    });

    return {
      ...crud,
      crudRef,
      remoteDict
    };
  }
});
</script>
