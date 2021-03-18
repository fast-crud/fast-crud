import useCrud from "./use/use-crud.ts";
import defaultCrudOptions from "./use/default-crud-options";
import utils from "./utils";
import { useCompute } from "./use/use-compute";
import { useDict } from "./use/use-dict.ts";
import { useDictDefine } from "./use/use-dict-define";
import { uiContext } from "./ui";
import { useTypes } from "./use/use-types";
import types from "./types/index";
import * as components from "./components";
import { i18n, useI18n } from "./local";
import useExpose from "./use/use-expose";

const { dict, setDictRequest } = useDictDefine();
const { ComputeValue, compute } = useCompute();
export {
  useCompute,
  ComputeValue,
  compute,
  dict,
  useDict,
  useCrud,
  utils,
  useI18n,
  uiContext,
  useExpose,
  useTypes,
  useDictDefine,
};
// export * from './components'
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
  },
};
