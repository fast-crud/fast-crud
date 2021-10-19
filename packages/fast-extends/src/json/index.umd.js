import FsExtendsType from "./type";
export * from "./type";
import { utils } from "@fast-crud/fast-crud";
const modules = import.meta.globEager("./components/*.vue");
const FsExtendsComponents = {
  install(app) {
    utils.vite.installSyncComponents(app, modules);
  }
};

export const FsExtendsJson = {
  install(app, options) {
    app.use(FsExtendsType, options);
    app.use(FsExtendsComponents);
  }
};
