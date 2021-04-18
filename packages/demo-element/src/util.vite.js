import { defineAsyncComponent } from "vue";
import _ from "lodash-es";

function installAsyncComponent(app, name, es, options) {
  const asyncComponent = defineAsyncComponent({
    loader: es
  });
  app.component(name, asyncComponent, options);
}

export default {
  installAsyncComponents(app, modules) {
    console.log("install names ", modules);
    _.forEach(modules, (item, name) => {
      console.log("name", name, item);
      installAsyncComponent(app, name, item);
    });
  }
};
