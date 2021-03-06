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
    password: {
      form: {
        component: {
          name: ui.inputPassword.name,
          vModel: ui.textArea.modelValue,
          [ui.input.clearable]: true,
          [ui.inputPassword.showPassword]: true,
        },
      },
    },
    textarea: {
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
