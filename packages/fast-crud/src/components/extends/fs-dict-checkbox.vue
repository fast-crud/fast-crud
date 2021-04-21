<template>
  <component :is="$fsui.checkboxGroup.name">
    <component
      :is="$fsui.checkbox.name"
      v-for="item of computedOptions"
      :key="getValue(item)"
      :[$fsui.checkbox.value]="getValue(item)"
      >{{ getLabel(item) }}</component
    >
  </component>
</template>
<script>
import { useDict } from "../../use/use-dict";
import { uiContext } from "../../ui";

/**
 * 字典checkbox
 * 支持el-checkbox|a-checkbox参数
 */
export default {
  name: "FsDictCheckbox",
  props: {
    /**
     * 字典
     */
    dict: {},
    /**
     * 选项，比dict.data优先级高
     */
    options: { type: Array, default: undefined, require: false }
  },
  setup(props, ctx) {
    const ui = uiContext.get();
    return {
      ...useDict(props, ctx, ui.checkboxGroup.modelValue)
    };
  }
};
</script>
