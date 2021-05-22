import { UiInterface } from "./ui-interface";
export * from "./ui-interface";
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
      throw new Error(
        '您还未设置ui,请在use(FastCrud)时,传入如下参数：app.use(FastCrud, {ui: { name: "antdv或element"}})'
      );
    }
    return this.ref;
  }
}
export const uiContext = new UiContext();
export default function () {
  return uiContext.get();
}
