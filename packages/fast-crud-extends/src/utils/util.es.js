import { defineAsyncComponent } from "vue";
import _ from "lodash-es";
function buildAsyncComponents(modules) {
  const asyncComponents = {};
  _.forEach(modules, (module, dir) => {
    _.forEach(module, (componentPath, name) => {
      asyncComponents[name] = defineAsyncComponent(() => {
        const asyncPath = "../lib/" + dir + "/" + componentPath;
        console.log("async component:", asyncPath);
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
  install(app, modules) {
    console.log("async install", modules);
    const asyncComponents = buildAsyncComponents(modules);
    _.forEach(asyncComponents, (value, key) => {
      app.component(key, value);
    });
  },
};
