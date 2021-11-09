import { ElMessage, ElNotification, ElMessageBox } from "element-plus";
import { uiContext } from "@fast-crud/fast-crud";
import { Element } from "./element.ts";
import setupIcons from "./icons";
export default {
  install(app) {
    const elementUi = new Element({
      Message: ElMessage,
      Notification: ElNotification,
      MessageBox: ElMessageBox
    });
    setupIcons(app);
    uiContext.set(elementUi);
    console.log("element installed");
  }
};
