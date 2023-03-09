<template>
  <component :is="$fsui.switch.name" v-bind="binding" />
</template>
<script>
import { useDict } from "../../use/use-dict";
import { uiContext } from "../../ui";

/**
 * 字典开关
 * 支持el-switch|a-switch的属性
 */
export default {
  name: "FsDictSwitch",
  props: {
    /**
     * 字典第一个为开启
     * 第二个为关闭
     */
    dict: {},
    options: {}
  },
  emits: ["dict-change"],
  setup(props, ctx) {
    const ui = uiContext.get();
    let usedDict = useDict(props, ctx, ui.switch.modelValue);
    const computedOptions = usedDict.createComputedOptions();
    return {
      ...usedDict,
      computedOptions
    };
  },
  computed: {
    _active() {
      if (this.computedOptions.length > 0) {
        return this.computedOptions[0];
      }
      return {};
    },
    _inActive() {
      if (this.computedOptions.length > 1) {
        return this.computedOptions[1];
      }
      return {};
    },
    binding() {
      const ui = uiContext.get();
      return {
        [ui.switch.activeText]: this._active[this.dict?.label || "label"],
        [ui.switch.inactiveText]: this._inActive[this.dict?.label || "label"],
        [ui.switch.activeColor]: this._active[this.dict?.color || "color"],
        [ui.switch.inactiveColor]: this._inActive[this.dict?.color || "color"],
        [ui.switch.activeValue]: this._active[this.dict?.value || "value"],
        [ui.switch.inactiveValue]: this._inActive[this.dict?.value || "value"]
      };
    }
  }
};
</script>
