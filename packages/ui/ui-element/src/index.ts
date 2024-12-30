// @ts-ignore
import { ElMessage, ElNotification, ElMessageBox } from "element-plus";
// @ts-ignore
import { uiContext } from "@fast-crud/ui-interface";
import { Element } from "./element";
import setupIcons from "./icons";

export * from "./element";
import "./style.less";
export type UiSetupOptions = {
  setupIcons?: boolean;
};

function set() {
  const elementUi = new Element({
    Message: ElMessage,
    Notification: ElNotification,
    MessageBox: ElMessageBox
  });
  uiContext.set(elementUi);
  return elementUi;
}

export default {
  install(app: any, options: UiSetupOptions = {}) {
    if (options.setupIcons !== false) {
      setupIcons(app);
    }

    return set();
  },
  set
};
