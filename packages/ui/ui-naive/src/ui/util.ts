// @ts-ignore
import { uiContext } from "@fast-crud/fast-crud";
import { useDialog, useMessage, useNotification } from "naive-ui";

export default {
  init() {
    if (uiContext.ref == null) {
      throw new Error("请先安装ui：app.use(UiNaive);");
    }
    const message = useMessage();
    const notification = useNotification();
    const messageBox = useDialog();
    // @ts-ignore
    uiContext.ref.init({ message, notification, messageBox });
  }
};
