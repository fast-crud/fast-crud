<template>
  <fs-container class="fs-layout-default">
    <template #header>
      <div class="fs-crud-header">
        <div class="fs-header-top">
          <slot name="header-top"></slot>
        </div>
        <slot name="search"></slot>
        <div class="fs-header-middle">
          <slot name="header-middle"></slot>
        </div>
        <slot name="actionbar"></slot>
        <slot name="toolbar"></slot>
        <div class="fs-header-bottom">
          <slot name="header-bottom"></slot>
        </div>
        <slot name="tabs"></slot>
      </div>
    </template>

    <!-- 默认插槽 -->
    <slot></slot>
    <!-- table -->
    <slot name="table"></slot>

    <slot name="form"> </slot>

    <template #footer>
      <div class="fs-crud-footer">
        <slot name="footer-top"></slot>
        <slot name="pagination"></slot>
        <slot name="footer-bottom"></slot>
      </div>
    </template>
  </fs-container>
</template>

<script lang="ts">
import { defineComponent } from "vue";
/**
 * 默认布局
 */
export default defineComponent({
  name: "FsLayoutDefault"
});
</script>

<style lang="less">
.fs-layout-default {
  .fs-tabs-filter {
    margin-top: 10px;
  }
}
</style>
