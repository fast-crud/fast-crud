import { utils } from "@fast-crud/fast-crud";
const modules = {
  FsFileUploader: () => import("./components/fs-file-uploader.js"),
  FsImagesFormat: () => import("./components/fs-images-format.js"),
  FsFileFormat: () => import("./components/fs-files-format.js"),
  FsCropper: () => import("./components/fs-cropper.js"),
  FsCropperUploader: () => import("./components/fs-cropper-uploader.js"),
  FsUploaderAlioss: () => import("./components/fs-uploader-alioss.js"),
  FsUploaderCos: () => import("./components/fs-uploader-cos.js"),
  FsUploaderQiniu: () => import("./components/fs-uploader-qiniu.js"),
  FsUploaderForm: () => import("./components/fs-uploader-form.js")
};

export default {
  install(app) {
    const imports = utils.vite.transformFromGlob(modules, ".js", (item) => {
      return item.then((module) => {
        return module._;
      });
    });
    utils.vite.installAsyncComponents(app, imports);
  }
};
