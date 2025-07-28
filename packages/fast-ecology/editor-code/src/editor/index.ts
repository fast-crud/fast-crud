import EcologyType from "./type";
export * from "./exports";
import { utils } from "@fast-crud/fast-crud";
// @ts-ignore
const asyncModules = import.meta.glob("./components/*/*.vue");
const FsExtendsComponents = {
  install(app: any) {
    utils.vite.installAsyncComponents(app, asyncModules, null, /^.*\/([^\/]+)\/.*.vue$/, null);
  }
};

export const FsEditorCode = {
  install(app: any, options: any) {
    app.use(EcologyType, options);
    app.use(FsExtendsComponents);
  }
};
