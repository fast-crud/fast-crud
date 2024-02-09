<template>
  <component :is="ui.checkboxGroup.name">
    <component
      :is="optionName || ui.checkbox.name"
      v-for="item of computedOptions"
      ref="checkboxRef"
      :key="getValue(item)"
      :[ui.checkbox.value]="getValue(item)"
      v-bind="optionProps"
      >{{ getLabel(item) }}</component
    >
  </component>
</template>
<script lang="ts">
import { useDict } from "../../use/use-dict";
import { defineComponent } from "vue";
import { useUi } from "../../use";

/**
 * 字典checkbox
 * 支持el-checkbox|a-checkbox参数
 */
export default defineComponent({
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
    },
    /**
     * 转换DictData
     */
    transformDictData: {
      type: Function,
      default: undefined
    }
  },
  emits: ["dict-change"],
  setup(props, ctx) {
    const { ui } = useUi();
    let usedDict = useDict(props, ctx, ui.checkboxGroup.modelValue);
    const computedOptions = usedDict.createComputedOptions();
    return {
      ui,
      ...usedDict,
      computedOptions
    };
  }
});
</script>
