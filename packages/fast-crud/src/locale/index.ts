import zhCN from "./lang/zh-cn";
import en from "./lang/en";
import _ from "lodash-es";
function t(key: string, args: any) {
  let value = _.get(zhCN, key);
  if (value == null) {
    return key;
  }
  if (args instanceof Array) {
    _.forEach(args, (arg, index) => {
      value = value.replace("{" + index + "}", arg);
    });
    return value;
  }
  return value.replace("{n}", args);
}
class I18n {
  vueI18nInstance: any = null;
  t(key: string, args: any) {
    return t(key, args);
  }
  setVueI18n(instance: any) {
    if (!instance) {
      return;
    }
    if (instance.global) {
      instance = instance.global;
    }
    instance.mergeLocaleMessage("zh-cn", { fs: zhCN.fs });
    instance.mergeLocaleMessage("en", { fs: en.fs });
    this.vueI18nInstance = instance;
  }
}

export const i18n = new I18n();

export function useI18n() {
  if (i18n.vueI18nInstance != null) {
    return {
      // @ts-ignore
      t: i18n.vueI18nInstance.t
    };
  }

  return { t: i18n.t };
}
