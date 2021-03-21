<template>
  <component :is="$fsui.cascader.name" :options="computedOptions" />
</template>
<script>
import { useDict } from "../../use/use-dict";
export default {
  name: "FsDictCascader",
  props: {
    dict: {},
    options: {},
  },
  setup(props, ctx) {
    const dictUseRet = useDict(props, ctx);
    return {
      ...dictUseRet,
    };
  },
};
</script>
