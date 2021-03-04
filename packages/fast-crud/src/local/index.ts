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
  tc(key, n) {
    const value = _.get(zhCN, key);
    if (value == null) {
      return key;
    }
    return value.replace("{n}", n);
  }
  setVueI18n(instance) {
    this.vueI18nInstance = instance;
  }
}

export const i18n = new I18n();

export function useI18n() {
  if (i18n.vueI18nInstance != null) {
    return {
      // @ts-ignore
      t: i18n.vueI18nInstance.global.t,
      // @ts-ignore
      tc: i18n.vueI18nInstance.global.tc,
    };
  }

  return { t: i18n.t, tc: i18n.tc };
}
