<template>
  <div class="fs-export-util"></div>
</template>

<script setup lang="ts">
import { exportUtil } from "./lib/index";
import { onMounted } from "vue";
function getLib() {
  return exportUtil;
}
const exposed = {
  getLib
};
defineExpose(exposed);
const emits = defineEmits(["ready"]);
onMounted(() => {
  emits("ready", {
    getLib
  });
});
</script>
<style lang="less"></style>
