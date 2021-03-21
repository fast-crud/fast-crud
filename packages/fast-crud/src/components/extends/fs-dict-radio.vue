<template>
  <component :is="$fsui.radioGroup.name">
    <component
      :is="$fsui.radio.name"
      v-for="item of computedOptions"
      :key="item.value"
      :[$fsui.radio.value]="item.value"
      >{{ item.label }}</component
    >
  </component>
</template>
<script>
import { useDict } from "../../use/use-dict";
import { uiContext } from "../../ui";

export default {
  name: "FsDictRadio",
  props: {
    dict: {},
  },
  setup(props, ctx) {
    const ui = uiContext.get();

    return {
      ...useDict(props, ctx, ui.radioGroup.modelValue),
    };
  },
};
</script>
