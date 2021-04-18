import { defineAsyncComponent } from "vue";
import _ from "lodash-es";
const modules = import.meta.glob("./components/*.vue");

const components = {};
_.forEach(modules, (item, key) => {
  let name = key.substring(key.lastIndexOf("/") + 1);
  name = name.replace(".vue", "");
  components[name] = item;
});

console.log("lazy vue components", components);

function installAsyncComponent(app, name, es, options) {
  const asyncComponent = defineAsyncComponent(es);
  app.component(name, asyncComponent, options);
}

export default {
  install(app) {
    _.forEach(components, (item, name) => {
      installAsyncComponent(app, name, item);
    });
  }
};
