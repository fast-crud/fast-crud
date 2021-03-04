<template>
  <component :is="$fsui.radioGroup.name">
    <component
      :is="$fsui.radio.name"
      v-for="item of dictData"
      :key="item.value"
      :[$fsui.radio.value]="item.value"
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
  setup(props, ctx) {
    return {
      ...useDict(props, ctx),
    };
  },
};
</script>
