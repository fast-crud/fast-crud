import { useTypes } from "@fast-crud/fast-crud";
import types from "./types";
import { merge } from "lodash-es";
import { defaultConfig, FsEditorConfig } from "./config.js";

function setConfig(app: any, config: FsEditorConfig) {
  app.config.globalProperties.$fs_editor_config = merge(defaultConfig, config);
}

export default {
  install(app: any, options: FsEditorConfig) {
    const newTypes = types();
    const { addTypes } = useTypes();
    addTypes(newTypes);
    setConfig(app, options);
  }
};
