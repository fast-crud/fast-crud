<template>
  <component :is="ui.switch.name" v-bind="binding" />
</template>
<script lang="ts">
import { useDict } from "../../use/use-dict";
import { uiContext } from "../../ui";
import { defineComponent, PropType } from "vue";
import { DictOptions, useUi } from "../../use";

/**
 * 字典开关
 * 支持el-switch|a-switch的属性
 */
export default defineComponent({
  name: "FsDictSwitch",
  props: {
    /**
     * 字典第一个为开启
     * 第二个为关闭
     */
    dict: {
      type: Object as PropType<DictOptions<any>>
    },
    options: {},
    /**
     * 转换DictData
     */
    transformDictData: {
      type: Function,
      default: undefined
    }
  } as any,
  emits: ["dict-change"],
  setup(props, ctx) {
    const { ui } = useUi();
    let usedDict = useDict(props, ctx, ui.switch.modelValue);
    const computedOptions = usedDict.createComputedOptions();
    return {
      ui,
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
});
</script>
