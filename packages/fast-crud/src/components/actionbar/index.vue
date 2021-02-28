<template>
  <div class="fs-actionbar">
    <template v-for="(value,key) in buttons" :key="key">
      <fs-button v-if="value.show!==false" v-bind="value" @click="onClick(key,value,$event)"></fs-button>
    </template>
  </div>
</template>
<script>
import { defineComponent } from 'vue'
import FsButton from '../basic/fs-button'
import traceUtil from '../../utils/util.trace'
export default defineComponent({
  name: 'fs-actionbar',
  components: { FsButton },
  emits: ['action'],
  props: {
    buttons: {}
  },
  setup (props, ctx) {
    traceUtil.trace('fs-actionbar')
    function onClick (key, value, $event) {
      const e = { key, btn: value, $event }
      if (value.click) {
        value.click(e)
        return
      }
      ctx.emit('action', e)
    }
    return {
      onClick
    }
  }
})
</script>
