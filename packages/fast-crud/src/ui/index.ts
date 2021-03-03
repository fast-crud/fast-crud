import { Element } from "./element";
import { Antdv } from "./antdv";
import { UiInterface } from "./ui-interface";
export class UiContext {
  ref?: UiInterface;
  set(ui) {
    if (ui.name === "antdv") {
      this.ref = new Antdv(ui.target);
    } else {
      this.ref = new Element(ui.target);
    }
  }

  get() {
    if (this.ref == null) {
      throw new Error(
        '您还未设置ui,请在use(FastCrud)时,传入如下参数：app.use(FastCrud, {ui: { name: "antdv|element", target: Antd|ElementPlus}})'
      );
    }
    return this.ref;
  }
}
export const uiContext = new UiContext();
export default function () {
  return uiContext.get();
}
