<template>
  <div class="fs-container">
    <div class="box">
      <div class="inner">
        <div class="header">
          <!-- header -->
          <slot name="header"></slot>
        </div>
        <div class="body">
          <!-- body, 高度自适应 -->
          <slot></slot>
        </div>
        <div class="footer">
          <!-- footer -->
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";

/**
 * crud的容器，根据外部高度自适应
 */
export default defineComponent({
  name: "FsContainer"
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
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      display: flex;
      flex-direction: column;
      .header {
        flex-shrink: 0;
      }
      .body {
        overflow-y: auto;
        flex: 1;
      }
      .footer {
        flex-shrink: 0;
      }
    }
  }
}
</style>
