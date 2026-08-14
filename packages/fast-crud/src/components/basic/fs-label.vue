<template>
  <div class="fs-label" :class="{ compact: compact }">
    <div class="label" v-bind="labelAttrs">
      {{ label }}
      <slot name="label"></slot>
    </div>
    <div class="content" v-bind="contentAttrs">
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
    compact: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: ""
    },
    labelAttrs: {
      type: Object,
      default: () => ({})
    },
    contentAttrs: {
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
  &.compact {
    .label {
      min-width: auto;
    }
    .content {
      min-width: auto;
    }
  }
  .label {
    display: flex;
    text-align: right;
    margin-right: 8px;
    min-width: 80px;
    justify-content: flex-end;
  }
  .content {
    flex: 1;
    display: flex;
    min-width: 80px;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: left;
    align-items: center;
  }
  margin-right: 15px;
}
</style>
