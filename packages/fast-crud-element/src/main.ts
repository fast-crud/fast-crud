import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { FastCrud } from "@fast-crud/fast-crud/src";
// import '@fast-crud/fast-crud/dist/style.css'
import ElementPlus, {
  ElMessage,
  ElNotification,
  ElMessageBox,
} from "element-plus";
import "element-plus/lib/theme-chalk/index.css";
import "./style/common.less";

import "dayjs/locale/zh-cn";
import i18n from "./i18n";
import { requestForMock } from "./api/service";
import "./mock";

const app = createApp(App);
app.use(ElementPlus, { size: "small", zIndex: 3000, i18n: i18n.global.t });
app.use(router);
app.use(i18n);
app.use(FastCrud, {
  i18n,
  async dictRequest({ dict }) {
    const res = await requestForMock({ url: dict.url });
    console.log("get dict", res);
    return res;
  },
  ui: {
    name: "element",
    target: {
      Message: ElMessage,
      Notification: ElNotification,
      MessageBox: ElMessageBox,
    },
  },
  commonOptions() {
    return {};
  },
});
app.mount("#app");
