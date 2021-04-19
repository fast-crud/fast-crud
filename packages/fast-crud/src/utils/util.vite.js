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

function installAsyncComponents(app, modules) {
  console.log("install names ", modules);
  _.forEach(modules, (item, name) => {
    console.log("name", name, item);
    installAsyncComponent(app, name, item);
  });
}
function transformFromGlob(modules, nameSuffix = ".vue", transform) {
  const components = {};
  _.forEach(modules, (item, key) => {
    let name = key.substring(key.lastIndexOf("/") + 1);
    name = name.replace(nameSuffix, "");
    if (transform) {
      item = transform(item);
    }
    components[name] = item;
  });
  return components;
}
export default {
  transformFromGlob,
  installAsyncComponents
};
