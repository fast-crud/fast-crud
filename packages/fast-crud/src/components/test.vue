<template>
<div>111</div>
</template>
<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'fs-crud-test',
  inheritAttrs: false,
  props: {

  },
  setup (props, ctx) {
    console.log('ctx', ctx)
  }
})
</script>
<style lang="less">
.fs-crud-container {
  height:100px;
}
</style>
