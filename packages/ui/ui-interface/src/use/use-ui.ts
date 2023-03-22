import { uiContext } from "../context";
import { UiInterface } from "../ui-interface";

export function useUi() {
  return {
    uiContext,
    ui: uiContext.get(),
    set: (ui: UiInterface) => {
      uiContext.set(ui);
    }
  };
}
