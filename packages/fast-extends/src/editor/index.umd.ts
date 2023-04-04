import FsUploaderType from "./type";
export * from "./type";
import { utils } from "@fast-crud/fast-crud";
import { FsEditorConfig } from "@/editor/type/config";
// @ts-ignore
const modules = import.meta.globEager("./components/*/*.vue");
const FsUploaderComponents = {
  install(app: any) {
    utils.vite.installSyncComponents(app, modules, null, /^.*\/([^\/]+)\/.*.vue$/, null);
  }
};

export const FsExtendsEditor = {
  install(app: any, options: FsEditorConfig) {
    app.use(FsUploaderType, options);
    app.use(FsUploaderComponents);
  }
};
