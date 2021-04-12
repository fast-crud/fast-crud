import { useTypes } from "@fast-crud/fast-crud";
import types from "./types";
import _ from "lodash-es";
import defaultConfig from "./config";

function setConfig(app, config) {
  app.config.globalProperties.$fs_uploader_config = _.merge(defaultConfig, config);
}
export default {
  install(app, options) {
    const newTypes = types();
    const { addTypes } = useTypes();
    addTypes(newTypes);

    setConfig(app, options);

    // _.forEach(components, (component, key) => {
    //   app.component(key, component);
    // });
  }
};
