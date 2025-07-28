import { useTypes } from "@fast-crud/fast-crud";
import types from "./types";

export default {
  install(app: any, options: any) {
    const newTypes = types();
    const { addTypes } = useTypes();
    addTypes(newTypes);
  }
};
