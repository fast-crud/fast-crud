import { uiContext } from "../ui";
import { UiInterface } from "@fast-crud/ui-interface";
export function useUi() {
  return {
    uiContext,
    ui: uiContext.get(),
    set: (ui: UiInterface) => {
      uiContext.set(ui);
    }
  };
}
