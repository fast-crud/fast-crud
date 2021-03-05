import { uiContext } from "../../ui";
export default function () {
  const ui = uiContext.get();
  return {
    text: {
      form: {
        component: {
          name: ui.input.name,
          vModel: ui.textArea.modelValue,
          [ui.input.clearable]: true,
        },
      },
    },
    "text-area": {
      search: {
        component: {
          name: ui.input.name,
          type: "text",
          [ui.input.clearable]: true,
        },
      },
      form: {
        component: {
          name: ui.textArea.name,
          type: ui.textArea.type,
          vModel: ui.textArea.modelValue,
          [ui.input.clearable]: true,
        },
      },
    },
  };
}
