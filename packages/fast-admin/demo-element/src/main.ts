import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
// 基础组件
import ElementPlus from "element-plus";
import "element-plus/lib/theme-chalk/index.css";
import "./style/common.less";
import "@iconify/iconify";
import "@purge-icons/generated";
import "dayjs/locale/zh-cn";

//项目
import i18n from "./i18n";
import "./mock";
import components from "./components";

// fast-crud
import fsInstall from "./install";

// @ts-ignore
const app = createApp(App);
app.use(ElementPlus, { size: "small", zIndex: 3000, i18n: i18n.global.t });
app.use(router);
app.use(i18n);
app.use(components);
fsInstall(app, i18n);
app.mount("#app");
