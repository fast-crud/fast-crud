import { uiContext } from "../../ui";
export default function () {
  const ui = uiContext.get();
  return {
    text: {
      form: {
        component: {
          // el-input, a-input
          name: ui.input.name,
          vModel: ui.textArea.modelValue,
          [ui.input.clearable]: true
        }
      },
      search: {
        autoSearchTrigger: "enter"
      }
    },
    password: {
      form: {
        component: {
          // el-input / a-input-password
          name: ui.inputPassword.name,
          vModel: ui.inputPassword.modelValue,
          ...ui.inputPassword.passwordType
        }
      },
      search: {
        autoSearchTrigger: "enter"
      }
    },
    textarea: {
      search: {
        component: {
          // el-input / a-input
          name: ui.input.name,
          type: "text",
          [ui.input.clearable]: true
        },
        autoSearchTrigger: "enter"
      },
      form: {
        component: {
          // el-input / a-textarea
          name: ui.textArea.name,
          type: ui.textArea.type,
          vModel: ui.textArea.modelValue,
          [ui.input.clearable]: true
        }
      }
    }
  };
}
