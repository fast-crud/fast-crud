import FsUploaderType from "./type";
export * from "./type";
import { utils } from "@fast-crud/fast-crud";
import { FsUploaderOptions } from "./d/type";
export * from "./components/libs/";
// @ts-ignore
const modules = import.meta.globEager("./components/*.vue");
const FsUploaderComponents = {
  install(app: any) {
    utils.vite.installSyncComponents(app, modules, null, null, null);
  }
};

export const FsExtendsUploader = {
  install(app: any, options: FsUploaderOptions) {
    app.use(FsUploaderType, options);
    app.use(FsUploaderComponents);
  }
};
