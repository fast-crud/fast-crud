import enLocale from "element-plus/lib/locale/lang/en";
import zhLocale from "element-plus/lib/locale/lang/zh-cn";

import enFsLocale from "@fast-crud/fast-crud/dist/locale/lang/en";
import zhFsLocale from "@fast-crud/fast-crud/dist/locale/lang/zh-cn";

import en from "./locale/en";
import zh from "./locale/zh_CN";
import { createI18n } from "vue-i18n";
const messages = {
  [enLocale.name]: {
    label: "English",
    // el 这个属性很关键，一定要保证有这个属性，
    el: enLocale.el,
    fs: enFsLocale.fs,
    // 定义您自己的字典，但是请不要和 `el` 、`fs` 重复，这样会导致 ElementPlus 内部组件的翻译失效.
    m: en
  },
  [zhLocale.name]: {
    label: "简体中文",
    el: zhLocale.el,
    fs: zhFsLocale.fs,
    // 定义您自己的字典，但是请不要和 `el` 、`fs`重复，这样会导致 ElementPlus 内部组件的翻译失效.
    m: zh
  }
};

export default createI18n({
  legacy: false,
  locale: zhLocale.name,
  fallbackLocale: enLocale.name,
  messages
});
