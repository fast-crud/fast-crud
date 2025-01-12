<template>
  <span class="fs-iconify" :class="{ 'fs-iconify-spin': spin }">
    <Icon ref="iconifyRef" :icon="icon" :inline="true" />
  </span>
</template>
<script lang="ts">
import { defineComponent, nextTick, onMounted, ref, unref, watch } from "vue";
import { Icon } from "@iconify/vue";
/**
 * iconify 按需加载图标组件
 * https://iconify.design/icon-sets/ion/
 */
export default defineComponent({
  name: "FsIconify",
  components: { Icon },
  props: {
    /**
     * 图标名称
     */
    icon: {
      type: String
    },
    /**
     * 旋转
     */
    spin: {
      type: Boolean,
      default: false
    }
  },
  setup(props, ctx) {
    const iconifyRef = ref(null);
    return { iconifyRef };
  }
});
</script>
<style lang="less">
.fs-iconify {
  //display: inline-flex !important;
  display: inline-flex;
  align-items: center;
  &-spin {
    svg {
      animation: fsLoadingCircle 1s infinite linear;
    }
  }

  &.fs-icon {
    display: inline-flex;
  }
}

@keyframes fsLoadingCircle {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@-webkit-keyframes fsLoadingCircle {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

//span.iconify {
//  display: block;
//  min-width: 1em;
//  min-height: 1em;
//  // background-color: @iconify-bg-color;
//  border-radius: 100%;
//}
</style>
