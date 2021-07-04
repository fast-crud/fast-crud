import { useTypes } from "@fast-crud/fast-crud";
import types from "./types";
import _ from "lodash-es";
import defaultConfig from "./config";
import { AllUploadSuccessValidator } from "./validators";

function setConfig(app, config) {
  app.config.globalProperties.$fs_uploader_config = _.merge(defaultConfig, config);
}
//兼容旧版本
const AllSuccessValidator = AllUploadSuccessValidator;
export { AllUploadSuccessValidator, AllSuccessValidator };
export default {
  install(app, options) {
    const newTypes = types();
    const { addTypes } = useTypes();
    addTypes(newTypes);
    setConfig(app, options);
  }
};
