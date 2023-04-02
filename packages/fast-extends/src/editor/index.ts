import ExtendsType from "./type";
export * from "./type";
import { utils } from "@fast-crud/fast-crud";
import { FsEditorConfig } from "./type/config";
// @ts-ignore
const asyncModules = import.meta.glob("./components/*/*.vue");
const FsUploaderComponents = {
  install(app: any) {
    utils.vite.installAsyncComponents(app, asyncModules, null, /^.*\/([^\/]+)\/.*.vue$/, null);
  }
};

export const FsExtendsEditor = {
  install(app: any, options: FsEditorConfig) {
    app.use(ExtendsType, options);
    app.use(FsUploaderComponents);
  }
};
