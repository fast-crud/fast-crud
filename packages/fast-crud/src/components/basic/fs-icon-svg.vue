<template>
  <span :class="['fs-icon-svg', spin && 'fs-icon-spin']">
    <svg class="fs-icon-svg-content" aria-hidden="true">
      <use :xlink:href="symbolId"></use>
    </svg>
  </span>
</template>
<script lang="ts">
import type { CSSProperties } from "vue";
import { defineComponent, computed } from "vue";

export default defineComponent({
  name: "FsSvgIcon",
  props: {
    icon: {
      type: String,
      required: true
    },
    size: {
      type: [Number, String],
      default: 16
    },
    spin: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const symbolId = computed(() => `#${props.icon}`);

    const getStyle = computed((): CSSProperties => {
      const { size } = props;
      let s = `${size}`;
      s = `${s.replace("px", "")}px`;
      return {
        width: s,
        height: s
      };
    });
    return { symbolId, getStyle };
  }
});
</script>
<style lang="less">
.fs-icon-svg {
  display: inline-block;
  vertical-align: middle;
  &.fs-icon-spin {
    animation: loadingCircle 1s infinite linear;
  }

  .fs-icon-svg-content {
    width: 1em;
    height: 1em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
  }
}
</style>
