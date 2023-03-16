import FsExtendsType from "./type";
import { utils } from "@fast-crud/fast-crud";
// @ts-ignore
const modules = import.meta.globEager("./components/*.vue");
import { VueClipboard } from "@soerenmartius/vue3-clipboard";
const FsExtendsComponents = {
  install(app: any) {
    utils.vite.installSyncComponents(app, modules, null, null, null);
  }
};

export const FsExtendsCopyable = {
  install(app: any) {
    app.use(FsExtendsType);
    app.use(FsExtendsComponents);
    app.use(VueClipboard);
  }
};
