import FsUploader from "./uploader";
export default {
  install(app) {
    app.use(FsUploader);
  }
};
