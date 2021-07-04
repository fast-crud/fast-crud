import FsUploaderType from "./type";
export * from "./type";
import { utils } from "@fast-crud/fast-crud";
const asyncModules = import.meta.glob("./components/*.vue");
const syncModules = import.meta.globEager("./components/fs-images-format.vue");
console.log("modules", syncModules, asyncModules);
const FsUploaderComponents = {
  install(app) {
    utils.vite.installAsyncComponents(app, asyncModules);
  }
};

export default {
  install(app, options) {
    app.use(FsUploaderType, options);
    app.use(FsUploaderComponents);
  }
};
