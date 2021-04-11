import { useTypes } from "@fast-crud/fast-crud";
import types from "./types";
import { useUploader } from "./components/uploader-impl";
import esInstall from "../../utils/util.es";
const imports = import.meta.glob("./components/**/*.vue");
console.log("uploader modules ", imports);

export default {
  install(app, options) {
    const newTypes = types();
    const { addTypes } = useTypes();
    addTypes(newTypes);

    const { setConfig } = useUploader();
    setConfig(options);

    esInstall.install(app, components, imports);
  },
};
