import FsUploaderType from "./type";
export { FsUploaderType };
import Components from "./index.eager";
export default {
  install(app, options) {
    app.use(FsUploaderType, options);
    app.use(Components);
  }
};
