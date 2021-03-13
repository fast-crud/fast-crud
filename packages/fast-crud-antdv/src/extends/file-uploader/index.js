import FsImagesFormat from "./lib/fs-images-format.vue";
import FsFilesFormat from "./lib/fs-files-format.vue";
import FsElFileUploader from "./lib/fs-el-file-uploader.vue";
import FsCropperUploader from "./lib/fs-cropper-uploader.vue";
import FsCropper from "./lib/cropper/index.vue";
import FsUploader from "./uploader";
import uploaderTypes from "./types";
import { types } from "@fast-crud/fast-crud";
function install(Vue, options) {
  Vue.component("FsFileUploader", FsElFileUploader);
  Vue.component("FsImagesFormat", FsImagesFormat);
  Vue.component("FsCropperUploader", FsCropperUploader);
  Vue.component("FsCropper", FsCropper);
  Vue.component("FsFilesFormat", FsFilesFormat);

  if (options != null) {
    Vue.use(FsUploader, options);
  }

  // 配置type
  if (types != null) {
    types.addTypes(uploaderTypes);
  }
}

const createAllUploadedValidator = getFormComponentRef => {
  return (rule, value, callback) => {
    const ref = getFormComponentRef(rule.fullField);
    if (ref && ref.isHasUploadingItem()) {
      callback(new Error("还有未上传完成的文件"));
      return;
    }
    callback();
  };
};

export default {
  install,
  createAllUploadedValidator
};
