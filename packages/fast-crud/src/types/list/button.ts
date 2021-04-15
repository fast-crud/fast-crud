import { uiContext } from "../../ui";

export default function () {
  const ui = uiContext.get();
  return {
    button: {
      form: {
        component: {
          name: ui.input.name,
          vModel: ui.input.modelValue,
          [ui.input.clearable]: true
        }
      },
      column: {
        component: {
          name: "fs-button",
          vModel: "text"
        }
      }
    },
    link: {
      form: {
        component: {
          name: ui.input.name,
          vModel: ui.input.modelValue,
          [ui.input.clearable]: true
        }
      },
      column: {
        component: {
          name: "fs-button",
          vModel: "text",
          type: ui.button.text
        }
      }
    }
  };
}
