<template>
  <el-radio-group >
    <el-radio  v-for="item of dictData" :key="item.value" :label="item.value" >{{item.label}}</el-radio>
  </el-radio-group>
</template>
<script>
import { useDict } from '../../use/use-dict'

export default {
  name: 'fs-dict-radio',
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
