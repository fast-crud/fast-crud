// icon type

import { uiContext } from "../../ui";

export default function () {
  const ui = uiContext.get();
  return {
    icon: {
      form: {
        component: {
          name: "fs-icon-selector", //el-button,a-button
          vModel: "modelValue",
          [ui.input.clearable]: true
        }
      },
      column: {
        component: {
          name: "fs-icon",
          vModel: "icon",
          style: "font-size:18px"
        }
      }
    }
  };
}
