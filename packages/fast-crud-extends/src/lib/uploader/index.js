import { useTypes } from "@fast-crud/fast-crud";
import types from "./types";
import { useUploader } from "./components/uploader-impl";
import components from "./components";
import _ from "lodash-es";
export default {
  install(app, options) {
    const newTypes = types();
    const { addTypes } = useTypes();
    addTypes(newTypes);

    const { setConfig } = useUploader();
    setConfig(options);

    _.forEach(components, (component, key) => {
      app.component(key, component);
    });
  },
};
