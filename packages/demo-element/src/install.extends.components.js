import viteUtils from "./util.vite";
const FsUploaderComponents = {
  "fs-file-uploader": () => import("../node_modules/@fast-crud/extends-uploader/dist/components/fs-file-uploader.js"),
  FsImagesFormat: () => import("../node_modules/@fast-crud/extends-uploader/dist/components/fs-images-format.js"),
  FsFileFormat: () => import("../node_modules/@fast-crud/extends-uploader/dist/components/fs-files-format.js"),
  FsCropper: () => import("../node_modules/@fast-crud/extends-uploader/dist/components/fs-cropper.js"),
  FsCropperUploader: () => import("../node_modules/@fast-crud/extends-uploader/dist/components/fs-cropper-uploader.js"),
  FsUploaderAlioss: () => import("../node_modules/@fast-crud/extends-uploader/dist/components/fs-uploader-alioss.js"),
  FsUploaderCos: () => import("../node_modules/@fast-crud/extends-uploader/dist/components/fs-uploader-cos.js"),
  FsUploaderQiniu: () => import("../node_modules/@fast-crud/extends-uploader/dist/components/fs-uploader-qiniu.js"),
  FsUploaderForm: () => import("../node_modules/@fast-crud/extends-uploader/dist/components/fs-uploader-form.js")
};

const FsUploaderComponent = {
  install(app) {
    viteUtils.installAsyncComponents(app, FsUploaderComponents);
  }
};
export { FsUploaderComponent };
