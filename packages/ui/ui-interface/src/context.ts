import { Ref, ref } from "vue";
import { UiInterface } from "./ui-interface";

export class UiContext {
  ref?: Ref<UiInterface> = ref(null);
  set(ui: UiInterface) {
    this.ref.value = ui;
  }

  get(): UiInterface {
    if (this.ref.value == null) {
      throw new Error("您还未设置ui,请在use(FastCrud)前，安装ui，“app.use(UiXxx)”");
    }
    return this.ref.value;
  }
}
export const uiContext = new UiContext();
export default function () {
  return uiContext.get();
}
