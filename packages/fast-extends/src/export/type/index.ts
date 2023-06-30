import { useTypes } from "@fast-crud/fast-crud";
import types from "./types";
export * from "../components/lib/index";
export default {
  install(app: any) {
    const newTypes = types();
    const { addTypes } = useTypes();
    addTypes(newTypes);
  }
};
