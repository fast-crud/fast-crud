// @ts-ignore
import { ElMessage, ElNotification, ElMessageBox } from "element-plus";
// @ts-ignore
import { uiContext } from "@fast-crud/ui-interface";
import { Element } from "./element";
import setupIcons from "./icons";

export * from "./element";
export default {
  install(app: any) {
    const elementUi = new Element({
      Message: ElMessage,
      Notification: ElNotification,
      MessageBox: ElMessageBox
    });
    setupIcons(app);
    uiContext.set(elementUi);
    return elementUi;
  }
};
