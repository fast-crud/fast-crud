import { utils } from "@fast-crud/fast-crud";
const modules = import.meta.glob("./components/*.vue");
export default {
  install(app) {
    const imports = utils.vite.transformFromGlob(modules);
    utils.vite.installAsyncComponents(app, imports);
  }
};
