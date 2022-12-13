<template>
  <slot name="default"></slot>
</template>

<script lang="ts" setup>
  // add by fast-curd, 初始化ui，必须写在setup里面,获取message实例
  import UiNaive from '@fast-crud/ui-naive';
  UiNaive.init();
</script>
