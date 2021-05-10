import { uiContext } from "../../ui";

function antdvColspan(ui) {
  return ui.type !== "antdv" ? {} : { labelCol: { span: 2 }, wrapperCol: { span: 21 } };
}

/**
 * 辅助type
 */
export default function () {
  const ui = uiContext.get();
  return {
    colspan: {
      //跨列
      form: {
        col: { span: 24 },
        ...antdvColspan(ui)
      }
    }
  };
}
