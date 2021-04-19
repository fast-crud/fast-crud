import { utils } from "@fast-crud/fast-crud";
const modules = import.meta.globEager("./components/*.vue");
export default {
  install(app) {
    const imports = utils.vite.transformFromGlob(modules);
    for (let key in imports) {
      app.component(key, imports[key]);
    }
  }
};
