<template>
  <div v-if="loading" class="fs-loading">
    <fs-icon class="fs-icon-spin" :icon="icon ?? ui.icons.refresh"></fs-icon>
    <span v-if="text">{{ text }}</span>
  </div>
</template>
<script setup lang="ts">
import { useUi } from "../../use";

defineOptions({
  name: "FsLoading"
});
const { ui } = useUi();
const props = defineProps<{
  loading?: boolean;
  icon?: string;
  text?: string;
}>();
</script>
<style lang="less">
.fs-loading {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .fs-icon {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 90%;
    height: 90%;
    max-width: 50px;
    max-height: 50px;
    &.fs-icon-spin {
      svg {
        animation: fs-loading-circle 1s infinite linear;
      }
    }
  }

  @-webkit-keyframes fs-loading-circle {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
}
</style>
