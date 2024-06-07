<template>
  <component :is="ui.checkboxGroup.name" @change="onSelectedChange">
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
  emits: [
    /**
     * 字典数据变化事件
     */
    "dict-change",

    /**
     * 选中值变化事件，可以获取到当前选中的option对象
     */
    "selected-change",
    /**
     * 值变化事件
     */
    "change"
  ],
  setup(props, ctx) {
    const { ui } = useUi();
    let usedDict = useDict(props, ctx, ui.checkboxGroup.modelValue);
    const computedOptions = usedDict.createComputedOptions();
    const onSelectedChange = (value: any) => {
      ctx.emit("change", value);
      if (value) {
        let selectedOptions = [];
        const dict = usedDict.getDict();
        if (dict && dict.dataMap) {
          for (let item of value) {
            const opt = dict.dataMap[item];
            if (opt) {
              selectedOptions.push(opt);
            }
          }
          ctx.emit("selected-change", selectedOptions);
        }
      } else {
        ctx.emit("selected-change", null);
      }
    };

    return {
      ui,
      ...usedDict,
      computedOptions,
      onSelectedChange
    };
  }
});
</script>
