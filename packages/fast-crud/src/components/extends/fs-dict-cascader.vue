<template>
  <component :is="$fsui.cascader.name" :options="computedOptions" />
</template>
<script>
import { useDict } from "../../use/use-dict";
export default {
  name: "FsDictCascader",
  props: {
    dict: {},
    //选项，比dict.data优先级高
    options: { type: Array },
  },
  setup(props, ctx) {
    const dictUseRet = useDict(props, ctx);
    return {
      ...dictUseRet,
    };
  },
};
</script>
