import FsUploaderType from "./type";
import FsUploaderComponents from "./install";

export { FsUploaderType, FsUploaderComponents };

export default {
  install(app, options) {
    app.use(FsUploaderType, options);
    app.use(FsUploaderComponents);
  }
};
