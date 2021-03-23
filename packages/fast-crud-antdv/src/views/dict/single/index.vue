<template>
  <fs-crud ref="crudRef" v-bind="crudOptions">
    <template #actionbar-right>
      <div style="margin-left:10px;">单例dict，修改一个，影响全部</div>
      <a-button @click="onClick">onClick</a-button>
    </template>
  </fs-crud>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
import { useCrud } from "/src/fs";
import createCrudOptions from "./crud";
import { useExpose } from "@fast-crud/fast-crud";
export default defineComponent({
  name: "DictSingle",
  setup() {
    // crud组件的ref
    const crudRef = ref();
    // crud 配置的ref
    const crudOptions = ref();
    // 暴露的方法
    const expose = useExpose({ crudRef, crudOptions });
    // 你的crud配置
    const options = createCrudOptions({ expose });
    // 初始化crud配置
    // eslint-disable-next-line @typescript-eslint/no-unused-vars,no-unused-vars
    const { resetCrudOptions } = useCrud({ expose, options });
    // 你可以调用此方法，重新初始化crud配置
    // resetCrudOptions(options)

    // 页面打开后获取列表数据
    onMounted(() => {
      expose.doRefresh();
    });

    function onClick() {
      console.log("this.ref", crudRef.value);
    }

    return {
      crudOptions,
      crudRef,
      onClick
    };
  }
});
</script>
