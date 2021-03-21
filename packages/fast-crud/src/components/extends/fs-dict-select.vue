<template>
  <component :is="$fsui.select.name" :placeholder="computedPlaceholder">
    <template v-for="item of computedOptions" :key="item.value">
      <component
        :is="$fsui.option.name"
        v-bind="item"
        :[$fsui.option.value]="item.value"
        :title="item.label"
        >{{ item.label }}</component
      >
    </template>
  </component>
</template>
<script>
import { computed } from "vue";
import useDict from "./use-dict";
export default {
  name: "FsDictSelect",
  props: {
    modelValue: {},
    dict: {},
    //选项，比dict.data优先级高
    options: { type: Array },
    placeholder: { type: String },
  },
  // render () {
  //   return this.renderFunc({ data: this.data, dataMap: this.dataMap, scope: this.scope, attrs: this.$attrs })
  // },
  setup(props, ctx) {
    const computedPlaceholder = computed(() => {
      return props.placeholder || "请选择";
    });

    return {
      computedPlaceholder,
      ...useDict(props, ctx),
    };
  },
};
</script>
