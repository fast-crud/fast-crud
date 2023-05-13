<template>
  <fs-form-provider>
    <slot></slot>
  </fs-form-provider>
</template>

<script lang="ts" setup>
// add by fast-curd, 初始化ui，获取message实例
import util from "./util";

util.init();
</script>
