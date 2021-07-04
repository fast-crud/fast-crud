<template>
  <span ref="iconifyRef" class="fs-iconify anticon" :class="{ 'fs-iconify-spin': spin }"></span>
</template>
<script lang="ts">
import { defineComponent, nextTick, onMounted, ref, unref, watch } from "vue";
/**
 * iconify 按需加载图标组件
 * https://iconify.design/icon-sets/ion/
 */
export default defineComponent({
  name: "FsIconify",
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
  setup(props) {
    const iconifyRef = ref(null);

    const update = async () => {
      if (!props.icon) return;

      const el: any = unref(iconifyRef);
      if (!el) return;

      await nextTick();
      const span: any = document.createElement("span");
      span.className = "iconify";
      span.dataset.icon = props.icon;
      el.textContent = "";
      el.appendChild(span);
    };

    watch(() => props.icon, update, { flush: "post" });

    onMounted(update);

    return { iconifyRef };
  }
});
</script>
<style lang="less">
.fs-iconify {
  display: inline-block;
  vertical-align: middle;

  &-spin {
    svg {
      animation: loadingCircle 1s infinite linear;
    }
  }
}

span.iconify {
  display: block;
  min-width: 1em;
  min-height: 1em;
  // background-color: @iconify-bg-color;
  border-radius: 100%;
}
</style>
