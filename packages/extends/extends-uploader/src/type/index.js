import { useTypes } from "@fast-crud/fast-crud";
import types from "./types";
import _ from "lodash-es";
import defaultConfig from "./config";
import { AllSuccessValidator } from "./validators";

function setConfig(app, config) {
  app.config.globalProperties.$fs_uploader_config = _.merge(defaultConfig, config);
}
export { AllSuccessValidator };
export default {
  install(app, options) {
    const newTypes = types();
    const { addTypes } = useTypes();
    addTypes(newTypes);
    setConfig(app, options);
  }
};
