import FsExtendsType from "./type";
import { utils } from "@fast-crud/fast-crud";
const modules = import.meta.globEager("./components/*.vue");
const FsExtendsComponents = {
  install(app) {
    utils.vite.installSyncComponents(app, modules);
  }
};

export const FsExtendsTime = {
  install(app, options) {
    app.use(FsExtendsType, options);
    app.use(FsExtendsComponents);
  }
};
