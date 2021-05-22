import { defineAsyncComponent } from "vue";
import iconify from "./iconify/index.vue";
function installAsyncComponent(app, name, es, options) {
  const asyncComponent = defineAsyncComponent(es);
  app.component(name, asyncComponent, options);
}
export default {
  install(app) {
    installAsyncComponent(app, "D2Highlight", () => import("./d2-highlight/index.vue"));
    app.component(iconify);
  }
};
