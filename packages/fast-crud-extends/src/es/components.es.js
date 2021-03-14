import modules from "../lib/components.es";
import { defineAsyncComponent } from "vue";
import _ from "lodash-es";
function buildAsyncComponents(modules) {
  const asyncComponents = {};
  _.forEach(modules, (module) => {
    _.forEach(module, (componentPath, name) => {
      asyncComponents[name] = defineAsyncComponent(() => {
        const asyncPath = "../lib/" + componentPath;
        return import(/* @vite-ignore */ asyncPath).then((ret) => {
          console.log("lazy component:", ret);
          return ret;
        });
      });
    });
  });
  return asyncComponents;
}
export default {
  install(app) {
    const asyncComponents = buildAsyncComponents(modules);
    _.forEach(asyncComponents, (value, key) => {
      app.component(key, value);
    });
  },
};
