<template>
  <a-config-provider :locale="locale">
    <router-view></router-view>
  </a-config-provider>

</template>

<script>
import { utils } from '@fast-crud/fast-crud'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
export default {
  name: 'App',
  data () {
    return {
      locale: zhCN
    }
  },
  setup () {
    utils.trace.trace()
  },
  renderTracked ({ key, target, type }) {
    console.log('tracked', 'app', { key, target, type })
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
    console.log('triggerd', 'app', { key, target, type })
  }
}
</script>
