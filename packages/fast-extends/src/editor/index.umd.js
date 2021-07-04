import FsUploaderType from "./type";
export * from "./type";
import { utils } from "@fast-crud/fast-crud";
const modules = import.meta.globEager("./components/*.vue");
const FsUploaderComponents = {
  install(app) {
    utils.vite.installSyncComponents(app, modules);
  }
};

export const FsExtendsEditor = {
  install(app, options) {
    app.use(FsUploaderType, options);
    app.use(FsUploaderComponents);
  }
};
