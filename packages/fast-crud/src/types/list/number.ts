import { uiContext } from "../../ui";
export default function () {
  const ui = uiContext.get();
  return {
    number: {
      form: {
        component: {
          name: ui.number.name,
          vModel: ui.modelValue,
        },
      },
    },
  };
}
