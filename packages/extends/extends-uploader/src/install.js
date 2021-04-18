import _ from "lodash-es";
const modules = import.meta.globEager("./components/*.vue");
console.log("modules", modules);

const components = {};
_.forEach(modules, (item, key) => {
  let name = key.substring(key.lastIndexOf("/") + 1);
  name = name.replace(".vue", "");
  components[name] = item.default;
});
export default {
  install(app) {
    _.forEach(components, (item, key) => {
      app.component(key, item);
    });
  }
};
