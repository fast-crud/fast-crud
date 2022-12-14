// @ts-ignore
import * as icons from "@element-plus/icons-vue";

export default function(app) {
  for (const key in icons) {
    app.component(key, icons[key]);
  }
}
