import { uiContext } from "../../ui";

export default function () {
  const ui = uiContext.get();
  return {
    button: {
      form: {
        component: {
          name: ui.input.name, //el-button,a-button
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
          name: ui.input.name, //el-input,a-input
          vModel: ui.input.modelValue,
          [ui.input.clearable]: true
        }
      },
      column: {
        component: {
          name: "fs-button",
          vModel: "text",
          ...ui.button.linkType
        }
      }
    }
  };
}
