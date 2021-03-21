<template>
  <component :is="$fsui.checkboxGroup.name">
    <component
      :is="$fsui.checkbox.name"
      v-for="item of computedOptions"
      :key="item.value"
      :[$fsui.checkbox.value]="item.value"
      >{{ item.label }}</component
    >
  </component>
</template>
<script>
import { useDict } from "../../use/use-dict";
import { uiContext } from "../../ui";

export default {
  name: "FsDictCheckbox",
  props: {
    dict: {},
  },
  setup(props, ctx) {
    const ui = uiContext.get();
    return {
      ...useDict(props, ctx, ui.checkboxGroup.modelValue),
    };
  },
};
</script>
