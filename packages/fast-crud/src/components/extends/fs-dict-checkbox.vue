<template>
  <component :is="$fsui.checkboxGroup.name">
    <component
      :is="$fsui.checkbox.name"
      v-for="item of dictData"
      :key="item.value"
      :[$fsui.checkbox.value]="item.value"
      >{{ item.label }}</component
    >
  </component>
</template>
<script>
import { useDict } from "../../use/use-dict";

export default {
  name: "FsDictCheckbox",
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
