import { uiContext } from "../ui";
export function useUi() {
  return {
    uiContext,
    ui: uiContext.get(),
    set: (ui) => {
      uiContext.set(ui);
    }
  };
}
