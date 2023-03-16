<template>
  <div class="fs-box">
    <slot></slot>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";

/**
 * 单纯的包裹一个子组件
 */
export default defineComponent({
  name: "FsBox"
});
</script>
