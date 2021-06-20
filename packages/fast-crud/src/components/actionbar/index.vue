<template>
  <div class="fs-actionbar">
    <template v-for="(value, key) in computedButtons" :key="key">
      <fs-button v-if="value.show !== false" v-bind="value" @click="onClick(key, value, $event)" />
    </template>
  </div>
</template>
<script>
import { defineComponent, toRef } from "vue";
import FsButton from "../basic/fs-button";
import traceUtil from "../../utils/util.trace";
import { useCompute } from "../../use/use-compute";

export default defineComponent({
  name: "FsActionbar",
  components: { FsButton },
  props: {
    /**
     * 按钮配置
     * {
     *  add:{
     *    ...FsButton,
     *    show:true
     *  },
     *  custom:{...}
     * }
     */
    buttons: {}
  },
  emits: ["action"],
  setup(props, ctx) {
    traceUtil.trace("fs-actionbar");
    function onClick(key, value, $event) {
      const e = { key, btn: value, $event };
      if (value.click) {
        value.click(e);
        return;
      }
      ctx.emit("action", e);
    }
    const { doComputed } = useCompute();
    const getScopeFn = () => {
      return {};
    };
    const refButtons = toRef(props, "buttons");
    const computedButtons = doComputed(refButtons, getScopeFn);
    return {
      onClick,
      computedButtons
    };
  }
});
</script>
<style lang="less">
.fs-actionbar {
  min-width: 1px;
}
</style>
