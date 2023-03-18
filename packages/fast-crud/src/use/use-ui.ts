import { UiInterface, uiContext } from "@fast-crud/ui-interface";

export function useUi() {
  return {
    uiContext,
    ui: uiContext.get(),
    set: (ui: UiInterface) => {
      uiContext.set(ui);
    }
  };
}
