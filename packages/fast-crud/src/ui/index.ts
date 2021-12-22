import { UiInterface } from "@fast-crud/ui-interface";
import { reactive } from "vue";
import _ from "lodash-es";
export class UiContext {
  ref?: UiInterface;
  set(ui: UiInterface) {
    if (this.ref == null) {
      this.ref = reactive(ui);
    } else {
      _.merge(this.ref, ui);
    }
  }

  get(): UiInterface {
    if (this.ref == null) {
      throw new Error("您还未设置ui,请在use(FastCrud)前，安装ui，“app.use(UiXxx)”");
    }
    return this.ref;
  }
}
export const uiContext = new UiContext();
export default function () {
  return uiContext.get();
}
