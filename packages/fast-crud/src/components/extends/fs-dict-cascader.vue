<template>
  <component :is="$fsui.cascader.name" :options="computedOptions" v-bind="fieldNamesBinder" />
</template>
<script>
import { useDict } from "../../use/use-dict";
import { useUi } from "../../use";
import { ref } from "vue";
/**
 * 字典级联组件
 * 支持el-cascader|a-cascader组件的参数
 */
export default {
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
  },
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
    return {
      ...dictUseRet,
      fieldNamesBinder
    };
  }
};
</script>
