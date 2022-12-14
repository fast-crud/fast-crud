import FsUploaderType from "./type";
export * from "./type";
import { utils } from "@fast-crud/fast-crud";
// @ts-ignore
const modules = import.meta.globEager("./components/*.vue");
const FsUploaderComponents = {
  install(app) {
    utils.vite.installSyncComponents(app, modules, null, null, null);
  }
};

export const FsExtendsUploader = {
  install(app, options) {
    app.use(FsUploaderType, options);
    app.use(FsUploaderComponents);
  }
};
