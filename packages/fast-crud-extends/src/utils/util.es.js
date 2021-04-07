import { defineAsyncComponent } from "vue";
import _ from "lodash-es";
function buildAsyncComponents(modules, imports) {
  const asyncComponents = {};
  _.forEach(modules, (componentPath, name) => {
    const asyncPath = "./" + componentPath;
    asyncComponents[name] = defineAsyncComponent(imports[asyncPath]);
  });
  return asyncComponents;
}
export default {
  install(app, modules, imports) {
    const asyncComponents = buildAsyncComponents(modules, imports);
    _.forEach(asyncComponents, (value, key) => {
      app.component(key, value);
    });
  },
};
