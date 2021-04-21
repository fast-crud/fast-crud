<template>
  <component :is="$fsui.radioGroup.name">
    <component
      :is="$fsui.radio.name"
      v-for="item of computedOptions"
      :key="getValue(item)"
      :[$fsui.radio.value]="getValue(item)"
    >
      {{ getLabel(item) }}
    </component>
  </component>
</template>
<script>
import { useDict } from "../../use/use-dict";
import { uiContext } from "../../ui";

/**
 * 字典单选框
 * 支持el-radio-group|a-radio-group的参数
 *
 */
export default {
  name: "FsDictRadio",
  props: {
    /**
     * 数据字典配置
     */
    dict: {},
    /**
     * 可选项，比dict.data优先级高
     */
    options: { type: Array }
  },
  setup(props, ctx) {
    const ui = uiContext.get();

    return {
      ...useDict(props, ctx, ui.radioGroup.modelValue)
    };
  }
};
</script>
