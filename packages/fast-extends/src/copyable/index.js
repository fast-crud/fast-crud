import FsExtendsType from "./type";
import { utils } from "@fast-crud/fast-crud";
const asyncModules = import.meta.glob("./components/*.vue");
const FsExtendsComponents = {
  install(app) {
    //加载异步组件，异步组件将会被懒加载，所以不用担心打包之后的体积问题
    utils.vite.installAsyncComponents(app, asyncModules, []);
  }
};

export const FsExtendsCopyable = {
  install(app, options) {
    app.use(FsExtendsType, options);
    app.use(FsExtendsComponents);
  }
};
