import { ComputeValue, compute } from "./core/compute-value";
import useCrud from "./use/use-crud.ts";
import defaultCrudOptions from "./use/default-crud-options";
import utils from "./utils";
import { setDictRequest, dict } from "./core/dict";
import { useDict } from "./use/use-dict.ts";
import { uiContext } from "./ui";
import types from "./types";
import * as components from "./components";
import { i18n } from "./local";
import useExpose from "./use/use-expose";
export {
  ComputeValue,
  compute,
  dict,
  useDict,
  useCrud,
  utils,
  uiContext,
  useExpose,
  types,
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
