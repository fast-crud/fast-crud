import { defineAsyncComponent } from "vue";
import _ from "lodash-es";

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

function installAsyncComponents(app, modules, excludes, nameSuffix, transform) {
  const imports = transformFromGlob(modules, nameSuffix, transform);
  _.forEach(imports, (item, name) => {
    if (excludes && excludes.indexOf(name)) {
      return;
    }
    installAsyncComponent(app, name, item);
  });
}

function installSyncComponents(app, modules, excludes, nameSuffix, transform) {
  const imports = transformFromGlob(modules, nameSuffix, transform);
  _.forEach(imports, (item, name) => {
    if (excludes && excludes.indexOf(name)) {
      return;
    }
    app.component(name, item);
  });
}
function transformFromGlob(modules, nameSuffix = ".vue", transform) {
  const components = {};
  _.forEach(modules, (item, key) => {
    // 从路径提取组件名称
    let name = key.substring(key.lastIndexOf("/") + 1);
    name = name.replace(nameSuffix, "");

    //将组件名称从 fs-uploader-form 转换为 FsUploaderForm
    name = _.camelCase(name);
    name = _.upperFirst(name);

    if (transform) {
      item = transform(item);
    }
    components[name] = item;
  });
  return components;
}
export default {
  transformFromGlob,
  installAsyncComponents,
  installSyncComponents
};
