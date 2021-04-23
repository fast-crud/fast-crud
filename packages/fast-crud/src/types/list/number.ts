import { uiContext } from "../../ui";
export default function () {
  const ui = uiContext.get();
  return {
    number: {
      form: {
        component: {
          // el-input-number,a-input-number
          name: ui.number.name,
          vModel: ui.modelValue
        }
      }
    }
  };
}
