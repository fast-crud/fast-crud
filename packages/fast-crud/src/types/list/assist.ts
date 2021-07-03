import { uiContext } from "../../ui";

function antdvColspan(ui, labelSpan) {
  return ui.type !== "antdv" ? {} : { labelCol: { span: labelSpan }, wrapperCol: { span: 23 - labelSpan } };
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
        ...antdvColspan(ui, 2)
      }
    },
    colspan3: {
      //跨列
      form: {
        col: { span: 24 },
        ...antdvColspan(ui, 3)
      }
    },
    colspan4: {
      //跨列
      form: {
        col: { span: 24 },
        ...antdvColspan(ui, 4)
      }
    }
  };
}
