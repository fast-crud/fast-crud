import { createI18n } from "vue-i18n";
import enLocale from "element-plus/lib/locale/lang/en";
import zhLocale from "element-plus/lib/locale/lang/zh-cn";

import enFsLocale from "@fast-crud/fast-crud/dist/local/lang/en";
import zhFsLocale from "@fast-crud/fast-crud/dist/local/lang/zh-cn";

const messages = {
  [enLocale.name]: {
    label: "English",
    // el 这个属性很关键，一定要保证有这个属性，
    el: enLocale.el,
    // 定义您自己的字典，但是请不要和 `el` 重复，这样会导致 ElementPlus 内部组件的翻译失效.
    message: {
      hello: "hello world"
    },
    fs: enFsLocale.fs
  },
  [zhLocale.name]: {
    label: "简体中文",
    el: zhLocale.el,
    // 定义您自己的字典，但是请不要和 `el` 重复，这样会导致 ElementPlus 内部组件的翻译失效.
    message: {
      hello: "你好，世界"
    },
    fs: zhFsLocale.fs
  }
};

export default createI18n({
  legacy: false,
  locale: zhLocale.name,
  fallbackLocale: enLocale.name,
  messages
});
