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

export default {
  install(app: any) {
    // @ts-ignore
    const naiveUi = new Naive();
    uiContext.set(naiveUi);
    app.component("FsUiContext", FsUiContext);
    setupIcons(app);
    return naiveUi;
  },
  init() {
    uiUtil.init();
  }
};
