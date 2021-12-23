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
      }
    },
    textarea: {
      search: {
        component: {
          // el-input / a-input
          name: ui.input.name,
          type: "text",
          [ui.input.clearable]: true
        }
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
