<template>
  <div ref="pageRef" class="fs-page">
    <div v-if="$slots.header != null" class="fs-page-header">
      <slot name="header"></slot>
    </div>

    <div class="fs-page-content">
      <slot></slot>
    </div>
    <div v-if="$slots.footer != null" class="fs-page-footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, Ref } from "vue";
import { utils } from "../../utils";
export default defineComponent({
  name: "FsPage",
  setup() {
    const pageRef: Ref = ref();
    onMounted(() => {
      const styles = window.getComputedStyle(pageRef.value.parentNode);
      const positionValue = styles.getPropertyValue("position");
      if (positionValue !== "relative") {
        utils.logger.warn(
          "fs-page父节点的position建议为relative,因为fs-page为相对定位（position:absolute），如果样式没有异常，你可以忽略此警告"
        );
      }
    });
    return {
      pageRef
    };
  }
});
</script>

<style lang="less">
.fs-page {
  width: 100%;
  top: 0;
  bottom: 0;
  position: absolute;
  display: flex;
  flex-direction: column;

  .fs-page-header {
    display: flex;
    align-items: center;
    border-bottom: 1px solid #ddd;
    > .title {
      flex: 1;
      justify-self: flex-start;
      padding: 18px;
      font-size: 16px;
      font-weight: bold;
      color: #444;

      .sub {
        font-size: 12px;
        color: gray;
        margin-left: 20px;
        font-weight: lighter;
      }
    }
    > .more {
      justify-self: flex-end;
      margin-right: 18px;
      font-size: 14px;
      display: flex;
    }
  }
  .fs-page-content {
    flex: 1;
    overflow: auto;
  }
}
</style>
