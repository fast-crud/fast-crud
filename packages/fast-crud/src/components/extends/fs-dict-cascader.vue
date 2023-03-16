<template>
  <component :is="ui.cascader.name" :options="computedOptions" v-bind="fieldNamesBinder" />
</template>
<script lang="ts">
import { useDict } from "../../use/use-dict";
import { useUi } from "../../use";
import { defineComponent, ref } from "vue";
/**
 * 字典级联组件
 * 支持el-cascader|a-cascader组件的参数
 */
export default defineComponent({
  name: "FsDictCascader",
  props: {
    /**
     * 字典配置
     */
    dict: {},
    /**
     * 选项，比dict.data优先级高
     */
    options: { type: Array }
  } as any,
  emits: ["dict-change"],
  setup(props, ctx) {
    const dictUseRet = useDict(props, ctx);
    const { ui } = useUi();
    const fieldNamesBinder = ref();
    if (props.dict) {
      fieldNamesBinder.value = ui.cascader.fieldNames({
        value: props.dict.value,
        label: props.dict.label,
        children: props.dict.children
      });
    }
    const computedOptions = dictUseRet.createComputedOptions();
    return {
      ui,
      ...dictUseRet,
      fieldNamesBinder,
      computedOptions
    };
  }
});
</script>
