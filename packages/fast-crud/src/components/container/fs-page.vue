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

<script>
export default {
  name: "FsPage"
};
</script>

<style lang="less">
.fs-page {
  height: 100%;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
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
