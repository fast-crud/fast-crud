import { defineAsyncComponent } from "vue";
import _ from "lodash-es";
const modules = {
  "fs-file-uploader": () => import("./components/fs-file-uploader.js"),
  FsImagesFormat: () => import("./components/fs-images-format.js"),
  FsFileFormat: () => import("./components/fs-files-format.js"),
  FsCropper: () => import("./components/fs-cropper.js"),
  FsCropperUploader: () => import("./components/fs-cropper-uploader.js"),
  FsUploaderAlioss: () => import("./components/fs-uploader-alioss.js"),
  FsUploaderCos: () => import("./components/fs-uploader-cos.js"),
  FsUploaderQiniu: () => import("./components/fs-uploader-qiniu.js"),
  FsUploaderForm: () => import("./components/fs-uploader-form.js")
};

const components = {};
_.forEach(modules, (item, key) => {
  debugger;
  let name = key.substring(key.lastIndexOf("/") + 1);
  name = name.replace(".js", "");
  components[name] = item;
});
console.log("lazy load components es,", modules, components);
function installAsyncComponent(app, name, es, options) {
  const asyncComponent = defineAsyncComponent({
    loader: es,
    onError(error, retry, fail, attempts) {
      console.error("load error", error);
      if (error.message.match(/fetch/) && attempts <= 3) {
        // 请求发生错误时重试，最多可尝试 3 次
        retry();
      } else {
        // 注意，retry/fail 就像 promise 的 resolve/reject 一样：
        // 必须调用其中一个才能继续错误处理。
        fail();
      }
    }
  });
  app.component(name, asyncComponent, options);
}

export default {
  install(app) {
    console.log("install names ", components);
    _.forEach(components, (item, name) => {
      console.log("name", name, item);
      installAsyncComponent(app, name, item);
    });
  }
};
