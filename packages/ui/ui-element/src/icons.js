import * as icons from "@element-plus/icons";

export default function (app) {
  for (let key in icons) {
    app.component(key, icons[key]);
  }
}
