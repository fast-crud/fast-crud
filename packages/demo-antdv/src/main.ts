import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import Antd from "ant-design-vue";
import "ant-design-vue/dist/antd.css";
import "./style/common.less";

import "./mock";
import i18n from "./i18n";
import components from "./components";
import FsCrudInstall from "./install.js";
// @ts-ignore
const app = createApp(App);
app.use(Antd);
app.use(router);
app.use(i18n);
app.use(components);
FsCrudInstall(app);
app.mount("#app");
