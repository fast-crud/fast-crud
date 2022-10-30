import { useTypes } from "@fast-crud/fast-crud";
import types from "./types";

//兼容旧版本
export default {
  install(app, options) {
    const newTypes = types();
    const { addTypes } = useTypes();
    addTypes(newTypes);
  }
};
