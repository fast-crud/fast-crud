import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import FastCrud from '@fast-crud/fast-crud'

import ElementPlus, { ElMessage, ElNotification, ElMessageBox } from 'element-plus'
import 'element-plus/lib/theme-chalk/index.css'
import './style/common.less'

import 'dayjs/locale/zh-cn'
import i18n from './i18n'
import { requestForMock } from './api/service'
import './mock'

// vue3的bug  npm link 时无法正常工作
const app = createApp(App)
app.use(ElementPlus, { size: 'small', zIndex: 3000, i18n: i18n.global.t })
app.use(router)
app.use(i18n)
app.use(FastCrud, {
  i18n: i18n.global.t,
  async dictRequest ({ dict }) {
    const res = await requestForMock({ url: dict.url })
    console.log('get dict', res)
    return res
  },
  commonOptions () { return {} },
  ui: {
    name: 'element',
    target: {
      Message: ElMessage,
      Notification: ElNotification,
      MessageBox: ElMessageBox
    }
  }
})
app.mount('#app')
