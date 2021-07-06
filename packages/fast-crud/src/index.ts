import defaultCrudOptions from "./use/default-crud-options";
import utils from "./utils/index";
export * from "./utils/index";
export * from "./use";
import types from "./types/index";
import * as components from "./components/index";
import { i18n, useI18n } from "./locale/";
import { uiContext } from "./ui";
export * from "./ui";
import { useDictDefine, useCompute } from "./use";
const { dict, setDictRequest } = useDictDefine();
const { ComputeValue, compute, asyncCompute } = useCompute();
export { ComputeValue, compute, asyncCompute, dict, utils, useI18n, uiContext };
export const FastCrud = {
  install(app, options) {
    if (options?.ui) {
      uiContext.set(options.ui);
    }
    if (options?.commonOptions) {
      defaultCrudOptions.commonOptions = options.commonOptions;
    }
    if (options?.dictRequest) {
      setDictRequest(options.dictRequest);
    }

    if (options?.i18n) {
      i18n.setVueI18n(options.i18n);
    }
    for (const key in components) {
      const com = components[key];
      app.component(key, com);
    }

    types.install();

    app.config.globalProperties.$fsui = uiContext.get();
  }
};
