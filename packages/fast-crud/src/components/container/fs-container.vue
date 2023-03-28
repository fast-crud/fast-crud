<template>
  <div class="fs-container">
    <div class="box">
      <div class="inner" :style="computedInnerStyle">
        <div class="header">
          <!-- header -->
          <slot name="header"></slot>
        </div>
        <div class="body" :style="computedBodyStyle">
          <!-- body, 高度自适应 -->
          <slot></slot>
        </div>
        <div class="footer">
          <!-- footer -->
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
    <slot name="box"></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { useMerge } from "../../use";
/**
 * crud的容器，根据外部高度自适应
 */
export default defineComponent({
  name: "FsContainer",
  props: {
    /**
     * 是否固定高度
     */
    fixedHeight: {
      type: Boolean,
      default: true
    },
    /**
     * body的样式
     */
    bodyStyle: {
      type: Object,
      default: () => {
        return {};
      }
    },
    /**
     * inner的样式
     */
    innerStyle: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  setup(props, ctx) {
    const { merge } = useMerge();
    const computedInnerStyle = computed(() => {
      if (props.fixedHeight === false) {
        return merge({ position: "relative" }, props.innerStyle);
      }
      return props.innerStyle;
    });

    const computedBodyStyle = computed(() => {
      if (props.fixedHeight === false) {
        return merge({ flex: "unset" }, props.bodyStyle);
      }
      return props.bodyStyle;
    });

    return {
      computedInnerStyle,
      computedBodyStyle
    };
  }
});
</script>

<style lang="less">
.fs-container {
  &.compact {
    padding: 0;
  }
  padding: 0 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
  .box {
    height: 100%;
    width: 100%;
    position: relative;
    display: flex;
    flex-direction: column;
    flex: 1;
    .inner {
      position: absolute;
      width: 100%;
      top: 0;
      bottom: 0;
      display: flex;
      flex-direction: column;
      .header {
        flex-shrink: 0;
      }
      .body {
        flex: 1;
        overflow-y: auto;
      }
      .footer {
        flex-shrink: 0;
      }
    }
  }
}
</style>
