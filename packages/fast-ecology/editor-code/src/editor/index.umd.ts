import FsExtendsModelType from "./type";
export * from "./exports";
import { utils } from "@fast-crud/fast-crud";
// @ts-ignore
const modules = import.meta.glob("./components/*/*.vue", { eager: true });
const FsExtendsComponents = {
  install(app: any) {
    utils.vite.installSyncComponents(app, modules, null, /^.*\/([^\/]+)\/.*.vue$/, null);
  }
};

export const FsEditorCode = {
  install(app: any, options: any) {
    app.use(FsExtendsModelType, options);
    app.use(FsExtendsComponents);
  }
};
