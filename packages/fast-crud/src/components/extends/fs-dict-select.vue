<template>
  <el-select>
    <el-option v-for="item of dictData" :key="item.value" :value="item.value" :label="item.label"/>
  </el-select>
</template>
<script>
import { useDict } from '../../use/use-dict'
export default {
  name: 'fs-dict-select',
  props: {
    dict: {}
  },
  // render () {
  //   return this.renderFunc({ data: this.data, dataMap: this.dataMap, scope: this.scope, attrs: this.$attrs })
  // },
  setup (props, ctx) {
    return {
      ...useDict(props, ctx)
    }
  }

}

</script>
