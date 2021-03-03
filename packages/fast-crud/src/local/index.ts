import zhCN from "./lang/zh-cn";
import _ from "lodash-es";
class I18n {
  vueI18nInstance = null;
  t(key) {
    const value = _.get(zhCN, key);
    if (value == null) {
      return key;
    }
    return value;
  }
  setVueI18n(instance) {
    this.vueI18nInstance = instance;
  }
}

export const i18n = new I18n();

export function useI18n() {
  if (i18n.vueI18nInstance != null) {
    // @ts-ignore
    return { t: i18n.vueI18nInstance.global.t };
  }

  return { t: i18n.t };
}
