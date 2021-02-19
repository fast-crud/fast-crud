import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import FastCrud from './components/fast-crud'

import ElementPlus from 'element-plus'
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
  dictRequest ({ url }) {
    const res = requestForMock({ url })
    return res.data
  },
  commonOptions () { return {} }
})
app.mount('#app')
