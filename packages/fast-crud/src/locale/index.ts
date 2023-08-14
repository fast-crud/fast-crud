import zhCN from "./lang/zh-cn";
import en from "./lang/en";
import { useMerge } from "../use";
import _ from "lodash-es";
import logger from "../utils/util.log";
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
    const { merge } = useMerge();
    const locales: string[] = instance.availableLocales;
    debugger;
    for (const item of locales) {
      if (item.startsWith("zh")) {
        const message = instance.getLocaleMessage(item);
        const fsClone = _.cloneDeep(message.fs);
        instance.mergeLocaleMessage(item, { fs: zhCN.fs });
        instance.mergeLocaleMessage(item, { fs: fsClone });
      } else if (item.startsWith("en")) {
        const message = instance.getLocaleMessage(item);
        const fsClone = _.cloneDeep(message.fs);
        instance.mergeLocaleMessage(item, { fs: en.fs });
        instance.mergeLocaleMessage(item, { fs: fsClone });
      }
      logger.debug("i18n", instance.getLocaleMessage(item));
    }
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
