<template>
  <div class="fs-label">
    <div class="label" v-bind="labelAttrs">{{ label }}</div>
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";

/**
 * label组件
 */
export default defineComponent({
  name: "FsLabel",
  props: {
    label: {
      type: String,
      default: ""
    },
    labelAttrs: {
      type: Object,
      default: () => ({})
    }
  }
});
</script>
<style lang="less">
.fs-label {
  display: flex;
  align-items: center;
  .label {
    text-align: right;
    margin-right: 10px;
    min-width: 100px;
  }
  .content {
    flex: 1;
    min-width: 100px;
  }
}
</style>
