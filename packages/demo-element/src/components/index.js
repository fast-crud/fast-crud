import { defineAsyncComponent } from "vue";
function installAsyncComponent(app, name, es, options) {
  const asyncComponent = defineAsyncComponent(es);
  app.component(name, asyncComponent, options);
}
export default {
  install(app) {
    installAsyncComponent(app, "D2Highlight", () => import("./d2-highlight/index.vue"));
  }
};
