// @ts-ignore
import { ElMessage, ElNotification, ElMessageBox } from "element-plus";
// @ts-ignore
import { uiContext } from "@fast-crud/ui-interface";
import { Element } from "./element";
import setupIcons from "./icons";

export * from "./element";

export type UiSetupOptions = {
  setupIcons?: boolean;
};

export default {
  install(app: any, options: UiSetupOptions = {}) {
    const elementUi = new Element({
      Message: ElMessage,
      Notification: ElNotification,
      MessageBox: ElMessageBox
    });
    if (options.setupIcons !== false) {
      setupIcons(app);
    }
    uiContext.set(elementUi);
    return elementUi;
  }
};
