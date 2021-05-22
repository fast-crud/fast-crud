import { createI18n } from "vue-i18n";
//
import enFsLocale from "@fast-crud/fast-crud/dist/local/lang/en.js";
import zhFsLocale from "@fast-crud/fast-crud/dist/local/lang/zh-cn.js";

const messages = {
  en: {
    label: "English",
    // 定义您自己的字典，但是请不要和 `fs` 重复，这样会导致 fast-crud 内部组件的翻译失效.
    message: {
      hello: "hello world"
    },
    fs: enFsLocale.fs
  },
  "zh-cn": {
    label: "简体中文",
    // 定义您自己的字典，但是请不要和 `fs` 重复，这样会导致 fast-crud  内部组件的翻译失效.
    message: {
      hello: "你好，世界"
    },
    fs: zhFsLocale.fs
  }
};

export default createI18n({
  legacy: false,
  locale: "zh-cn",
  fallbackLocale: "zh-cn",
  messages
});
