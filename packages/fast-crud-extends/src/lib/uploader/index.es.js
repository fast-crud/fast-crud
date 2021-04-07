import { useTypes } from "@fast-crud/fast-crud";
import types from "./types";
import { useUploader } from "./components/uploader-impl";
import esInstall from "../../utils/util.es";
const imports = import.meta.glob("./components/**/*.vue");
console.log("uploader modules ", imports);
const components = {
  FsCropper: "components/fs-cropper.vue",
  FsCropperUploader: "components/fs-cropper-uploader.vue",
  FsElFileUploader: "components/fs-el-file-uploader.vue",
  FsFileUploader: "components/fs-file-uploader.vue",
  FsFilesFormat: "components/fs-files-format.vue",
  FsImagesFormat: "components/fs-images-format.vue",
  FsAliossUploader: "components/uploader-impl/fs-alioss-uploader.vue",
  FsCosUploader: "components/uploader-impl/fs-cos-uploader.vue",
  FsQiniuUploader: "components/uploader-impl/fs-qiniu-uploader.vue",
  FsFormUploader: "components/uploader-impl/fs-form-uploader.vue",
};

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
