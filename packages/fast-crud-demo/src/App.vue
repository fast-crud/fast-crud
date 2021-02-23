<template>
  <router-view></router-view>
</template>

<script>
import { utils } from '@fast-crud/fast-crud'
export default {
  name: 'App',
  setup () {
    utils.trace.trace()
  },
  renderTracked ({ key, target, type }) {
    console.log('tracked', this.name, { key, target, type })
    /* 当组件第一次渲染时，这将被记录下来:
    {
      key: "cart",
      target: {
        cart: 0
      },
      type: "get"
    }
    */
  },
  renderTriggered ({ key, target, type }) {
    console.log('triggerd', this.name, { key, target, type })
  }
}
</script>
