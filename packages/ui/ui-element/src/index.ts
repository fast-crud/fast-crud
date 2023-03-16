// @ts-ignore
import { ElMessage, ElNotification, ElMessageBox } from "element-plus";
// @ts-ignore
import { uiContext } from "@fast-crud/fast-crud";
// @ts-ignore
import { Element } from "./element.ts";
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
  }
};
