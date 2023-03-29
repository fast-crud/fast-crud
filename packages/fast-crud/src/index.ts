import defaultCrudOptions from "./use/default-crud-options";
import { utils } from "./utils/index";
import types from "./types/index";
import * as components from "./components";
import { FsFormWrapper } from "./components";
import { i18n, useI18n } from "./locale/";
import { uiContext } from "./ui";
import { useDictDefine } from "./use";
import { App } from "vue";
import { FsSetupOptions } from "./d";

export * from "./utils/index";
export * from "./use";
export * from "./components";
export * from "./ui";
const { setDictRequest } = useDictDefine();
export { utils, useI18n, uiContext };
export * from "./d/index";

export const FastCrud = {
  install(app: App, options: FsSetupOptions = {}) {
    if (options.ui) {
      uiContext.set(options.ui);
    }
    if (options.commonOptions) {
      defaultCrudOptions.commonOptions = options.commonOptions;
    }
    if (options.dictRequest) {
      setDictRequest(options.dictRequest);
    }

    if (options.i18n) {
      i18n.setVueI18n(options.i18n);
    }
    for (const key in components) {
      // @ts-ignore
      const com = components[key];
      app.component(key, com);
    }

    FsFormWrapper._context = app._context;

    types.install();

    app.config.globalProperties.$fsui = uiContext.get();
  }
};
export default FastCrud;
