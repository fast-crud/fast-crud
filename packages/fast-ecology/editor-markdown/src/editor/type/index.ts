import { useTypes } from "@fast-crud/fast-crud";
import types from "./types";

export default {
  install() {
    const { addTypes } = useTypes();
    addTypes(types());
  }
};
