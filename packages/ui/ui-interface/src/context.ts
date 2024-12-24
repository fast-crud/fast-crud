import type { Ref } from "vue";
import { ref } from "vue";
import type { UiInterface } from "./ui-interface";

export class UiContext {
  ref?: Ref<UiInterface> = ref(null);
  set(ui: UiInterface) {
    this.ref.value = ui;
  }

  get(): UiInterface {
    if (this.ref.value == null) {
      throw new Error(
        "您还未设置ui,第一步：先安装依赖@fast-crud/ui-interface,然后在use(FastCrud)前安装ui，app.use(UiXxx)；第二步：如果是NaiveUI，还需要用fs-ui-context包裹router-view，请参考http://fast-crud.docmirror.cn/guide/start/integration.html#_5-naiveui%E7%9A%84%E9%A2%9D%E5%A4%96%E6%93%8D%E4%BD%9C"
      );
    }
    return this.ref.value;
  }
}
export const uiContext = new UiContext();
export default function () {
  return uiContext.get();
}
