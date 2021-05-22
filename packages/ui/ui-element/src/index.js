import { ElMessage, ElNotification, ElMessageBox } from "element-plus";
import { uiContext } from "@fast-crud/fast-crud";
import { Element } from "./element.ts";
export default {
  install() {
    const elementUi = new Element({
      Message: ElMessage,
      Notification: ElNotification,
      MessageBox: ElMessageBox
    });
    uiContext.set(elementUi);
    console.log("element installed");
  }
};
