import ExtendsType from "./type";
export * from "./type";
import { utils } from "@fast-crud/fast-crud";
const asyncModules = import.meta.glob("./components/*.vue");
const FsUploaderComponents = {
  install(app) {
    utils.vite.installAsyncComponents(app, asyncModules);
  }
};

export const FsExtendsEditor = {
  install(app, options) {
    app.use(ExtendsType, options);
    app.use(FsUploaderComponents);
  }
};
