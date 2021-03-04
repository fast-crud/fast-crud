import { createI18n } from "vue-i18n";
//
import enFsLocale from "@fast-crud/fast-crud/dist/lang/en.js";
import zhFsLocale from "@fast-crud/fast-crud/dist/lang/zh-cn.js";

const messages = {
  en: {
    // 定义您自己的字典，但是请不要和 `fs` 重复，这样会导致 fast-crud 内部组件的翻译失效.
    message: {
      hello: "hello world",
    },
    fs: enFsLocale.fs,
  },
  "zh-cn": {
    // 定义您自己的字典，但是请不要和 `fs` 重复，这样会导致 fast-crud  内部组件的翻译失效.
    message: {
      hello: "你好，世界",
    },
    fs: zhFsLocale.fs,
  },
  testLocale: {
    el: {},
    // 没有定义 message 字段，会 fallback 回到 en 去, fallbackLocale 的定义在下方 👇
  },
};

export default createI18n({
  locale: "en",
  fallbackLocale: "en",
  messages,
});
