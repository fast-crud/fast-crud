import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Antd from "ant-design-vue";
import UiAntdv from '@fast-crud/ui-antdv4'
import App from './App.vue'
import router from './router'

import ElementPlus from "element-plus";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import "element-plus/dist/index.css";
import "dayjs/locale/zh-cn";

import naive from 'naive-ui'


const app = createApp(App)

app.use(createPinia())
app.use(router)


app.use(naive)

app.use(ElementPlus, { size: "default", zIndex: 3000, locale: zhCn });

app.use(Antd)
app.use(UiAntdv)



app.mount('#app')
