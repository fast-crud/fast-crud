import FsExtendsType from "./type";
export * from "./type";
export * from "./d";
import { utils } from "@fast-crud/fast-crud";
import { register } from "./use/register";
// @ts-ignore
const asyncModules = import.meta.glob("./components/*.vue");
const FsExtendsComponents = {
  install(app: any) {
    //加载异步组件，异步组件将会被懒加载，所以不用担心打包之后的体积问题
    utils.vite.installAsyncComponents(app, asyncModules, [], null, null);
  }
};

export const FsExtendsExport = {
  install(app: any) {
    app.use(FsExtendsType);
    app.use(FsExtendsComponents);
    register();
  }
};

export async function loadFsExportUtil() {
  return await import.meta.glob("./components/lib/index.ts");
}
