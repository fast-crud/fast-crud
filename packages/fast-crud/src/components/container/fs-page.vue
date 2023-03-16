<template>
  <div class="fs-page">
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
import { defineComponent } from "vue";

export default defineComponent({
  name: "FsPage"
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
    }
  }
  .fs-page-content {
    flex: 1;
    overflow-y: auto;
  }
}
</style>
