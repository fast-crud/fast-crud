import FsUploaderType from "./type";
export * from "./type";
import { utils } from "@fast-crud/fast-crud";
const modules = import.meta.globEager("./components/*.vue");
const FsUploaderComponents = {
  install(app) {
    const imports = utils.vite.transformFromGlob(modules);
    for (let key in imports) {
      app.component(key, imports[key]);
    }
  }
};

export default {
  install(app, options) {
    app.use(FsUploaderType, options);
    app.use(FsUploaderComponents);
  }
};
