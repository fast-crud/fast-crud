import FsExtendsType from "./type";
export * from "./type";
export * from "./d";
import { utils } from "@fast-crud/fast-crud";
import { register } from "./use/register";
// @ts-ignore
const modules = import.meta.globEager("./components/*.vue");
const FsExtendsComponents = {
  install(app: any) {
    utils.vite.installSyncComponents(app, modules, null, null, null);
  }
};

export const FsExtendsExport = {
  install(app: any) {
    app.use(FsExtendsType);
    app.use(FsExtendsComponents);
    register();
  }
};
