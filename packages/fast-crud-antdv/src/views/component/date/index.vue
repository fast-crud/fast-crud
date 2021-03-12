<template>
  <fs-crud ref="crudRef" v-bind="crudOptions">
    <template #actionbar-right>
      <a-alert
        style="margin-left: 10px"
        message="关于日期时间，建议前后端统一使用时间戳（long类型）进行交互，可以避免时区转化带来的问题"
      />
    </template>
  </fs-crud>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
import { useCrud } from "/src/fs";
import createCrudOptions from "./crud";
export default defineComponent({
  name: "FormDate",
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
