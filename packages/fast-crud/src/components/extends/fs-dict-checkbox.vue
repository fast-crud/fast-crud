<template>
  <component :is="$fsui.checkboxGroup.name">
    <component
      :is="optionName || $fsui.checkbox.name"
      v-for="item of computedOptions"
      :key="getValue(item)"
      :[$fsui.checkbox.value]="getValue(item)"
      v-bind="optionProps"
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
    options: { type: Array, default: undefined, require: false },

    /**
     * 选项的组件名称
     */
    optionName: {
      type: String
    },

    /**
     * 选项的属性
     */
    optionProps: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  emits: ["dict-change"],
  setup(props, ctx) {
    const ui = uiContext.get();
    let usedDict = useDict(props, ctx, ui.checkboxGroup.modelValue);
    const computedOptions = usedDict.createComputedOptions();
    return {
      ...usedDict,
      computedOptions
    };
  }
};
</script>
