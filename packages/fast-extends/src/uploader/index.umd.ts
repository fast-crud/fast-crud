import FsUploaderType from "./type";
export * from "./type";
import { utils } from "@fast-crud/fast-crud";
import { FsUploaderOptions } from "./d/type";
export * from "./components/libs/";
export * from "./components/utils";
// @ts-ignore
const modules = import.meta.glob("./components/*.vue", { eager: true });
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
