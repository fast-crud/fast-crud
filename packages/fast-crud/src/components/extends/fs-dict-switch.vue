<template>
  <component :is="$fsui.switch.name" v-bind="binding" />
</template>
<script>
import { useDict } from "../../use/use-dict";
import { uiContext } from "../../ui";

export default {
  name: "FsDictSwitch",
  props: {
    dict: {},
    options: {},
  },
  setup(props, ctx) {
    const ui = uiContext.get();
    return {
      ...useDict(props, ctx, ui.switch.modelValue),
    };
  },
  computed: {
    _options() {
      if (this.options != null) {
        return this.options;
      }
      if (this.dictData != null) {
        return this.dictData;
      }
      return [];
    },
    _active() {
      if (this._options.length > 0) {
        return this._options[0];
      }
      return {};
    },
    _inActive() {
      if (this._options.length > 1) {
        return this._options[1];
      }
      return {};
    },
    binding() {
      const ui = uiContext.get();
      return {
        [ui.switch.activeText]: this._active[this.dict.label],
        [ui.switch.inactiveText]: this._inActive[this.dict.label],
        [ui.switch.activeColor]: this._active[this.dict.color],
        [ui.switch.inactiveColor]: this._inActive[this.dict.color],
        [ui.switch.activeValue]: this._active[this.dict.value],
        [ui.switch.inactiveValue]: this._inActive[this.dict.value],
      };
    },
  },
};
</script>
