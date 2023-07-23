// @ts-ignore
import { uiContext } from "@fast-crud/ui-interface";
import setupIcons from "./icons";
import { Naive } from "./naive";
// @ts-ignore
import FsUiContext from "./ui/fs-ui-context.vue";
// @ts-ignore
import uiUtil from "./ui/util.ts";

export * from "./naive";
export { FsUiContext };
export type UiSetupOptions = {
  setupIcons?: boolean;
};
export default {
  install(app: any, options: UiSetupOptions = {}) {
    // @ts-ignore
    const naiveUi = new Naive();
    uiContext.set(naiveUi);
    app.component("FsUiContext", FsUiContext);
    if (options.setupIcons !== false) {
      setupIcons(app);
    }
    return naiveUi;
  },
  init() {
    uiUtil.init();
  }
};
