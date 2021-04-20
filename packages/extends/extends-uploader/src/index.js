import FsUploaderType from "./type";
export * from "./type";
import { utils } from "@fast-crud/fast-crud";
const modules = import.meta.glob("./components/*.vue");
const FsUploaderComponents = {
  install(app) {
    const imports = utils.vite.transformFromGlob(modules);
    utils.vite.installAsyncComponents(app, imports);
  }
};

export default {
  install(app, options) {
    app.use(FsUploaderType, options);
    app.use(FsUploaderComponents);
  }
};
