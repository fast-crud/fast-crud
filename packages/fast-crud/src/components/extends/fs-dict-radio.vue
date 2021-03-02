<template>
  <component :is="$fsui.radioGroup.name">
    <component
      :is="$fsui.radio.name"
      v-for="item of dictData"
      :key="item.value"
      :label="item.value"
      >{{ item.label }}</component
    >
  </component>
</template>
<script>
import { useDict } from "../../use/use-dict";

export default {
  name: "FsDictRadio",
  props: {
    dict: {},
  },
  // render () {
  //   return this.renderFunc({ data: this.data, dataMap: this.dataMap, scope: this.scope, attrs: this.$attrs })
  // },
  setup(props, ctx) {
    return {
      ...useDict(props, ctx),
    };
  },
};
</script>
