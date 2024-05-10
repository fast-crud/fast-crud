// @ts-ignore
import { uiContext } from "@fast-crud/ui-interface";
import { useDialog, useMessage, useNotification } from "naive-ui";

export default {
  init() {
    if (uiContext?.ref?.value == null) {
      throw new Error("请先安装ui：app.use(UiNaive);");
    }
    const message = useMessage();
    const notification = useNotification();
    const messageBox = useDialog();
    // @ts-ignore
    uiContext.ref.value.init({ message, notification, messageBox });
  }
};
