<template>
  <component :is="$fsui.cascader.name" :options="computedOptions" />
</template>
<script>
import { useDict } from "../../use/use-dict";
import { computed } from "vue";
export default {
  name: "FsDictCascader",
  props: {
    dict: {},
    options: {},
  },
  setup(props, ctx) {
    const dictUseRet = useDict(props, ctx);
    const computedOptions = computed(() => {
      if (props.options) {
        return props.options;
      }
      return dictUseRet.dictData.value;
    });

    return {
      ...dictUseRet,
      computedOptions,
    };
  },
};
</script>
