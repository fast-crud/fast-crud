import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { FastCrud } from "@fast-crud/fast-crud";
import Antd, { message, notification, Modal } from "ant-design-vue";
import "ant-design-vue/dist/antd.css";
import "./style/common.less";

import { requestForMock } from "./api/service";
import "./mock";
import icons from "./icons";
import i18n from "./i18n";
import FsFileUploader from "./extends/file-uploader";
// import FsUploader from "./extends/file-uploader/uploader";
const app = createApp(App);
app.use(Antd);
// app.use(ElementPlus, { size: 'small', zIndex: 3000, i18n: i18n.global.t })
app.use(router);
app.use(i18n);
app.use(icons);
app.use(FastCrud, {
  async dictRequest({ url }) {
    return await requestForMock({ url });
  },
  commonOptions() {
    return {
      table: {
        size: "small",
        pagination: false
      },
      request: {
        transformQuery: ({ page, form }) => {
          return { current: page.currentPage, size: page.pageSize, ...form };
        },
        transformRes: ({ res }) => {
          return { currentPage: res.current, pageSize: res.size, ...res };
        }
      },
      form: {
        display: "flex"
      }
    };
  },
  ui: {
    name: "antdv",
    target: {
      Message: message,
      Notification: notification,
      MessageBox: Modal
    }
  }
});
app.use(FsFileUploader);
app.mount("#app");
