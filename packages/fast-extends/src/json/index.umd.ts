import FsExtendsType from "./type";
export * from "./type";
import { utils } from "@fast-crud/fast-crud";
// @ts-ignore
const modules = import.meta.glob("./components/*.vue", { eager: true });
const FsExtendsComponents = {
  install(app: any) {
    utils.vite.installSyncComponents(app, modules, null, null, null);
  }
};

export const FsExtendsJson = {
  install(app: any) {
    app.use(FsExtendsType);
    app.use(FsExtendsComponents);
  }
};
