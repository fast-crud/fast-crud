import FsUploaderType from "./type";
export { FsUploaderType };

export default {
  install(app, options) {
    app.use(FsUploaderType, options);
  }
};
