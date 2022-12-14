import FsExtendsType from "./type";
export * from "./type";
import { utils } from "@fast-crud/fast-crud";
// @ts-ignore
const modules = import.meta.globEager("./components/*.vue");
const FsExtendsComponents = {
  install(app) {
    utils.vite.installSyncComponents(app, modules, null, null, null);
  }
};

export const FsExtendsJson = {
  install(app, options) {
    app.use(FsExtendsType, options);
    app.use(FsExtendsComponents);
  }
};
