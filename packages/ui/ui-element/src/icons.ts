// @ts-ignore
import * as icons from "@element-plus/icons-vue";
const iconsList = icons as any;
export default function (app: any) {
  for (const key in iconsList) {
    app.component(key, iconsList[key]);
  }
}
