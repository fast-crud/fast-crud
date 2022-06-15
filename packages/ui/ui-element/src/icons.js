import * as icons from "@element-plus/icons-vue";

export default function (app) {
  for (let key in icons) {
    app.component(key, icons[key]);
  }
}
