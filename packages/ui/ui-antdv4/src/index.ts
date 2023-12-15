import { message, notification, Modal, Button } from "ant-design-vue";
import { uiContext } from "@fast-crud/ui-interface";
import setupIcons from "./icons";
import { Antdv } from "./antdv";
export * from "./antdv";
import "./style.less";
export type UiSetupOptions = {
  setupIcons?: boolean;
};

function set() {
  const antdvUi = new Antdv({
    Message: message,
    Notification: notification,
    MessageBox: Modal
  });
  uiContext.set(antdvUi);
  return antdvUi;
}

export default {
  install(app: any, options: UiSetupOptions = {}) {
    const antdvUi = set();
    if (options.setupIcons !== false) {
      setupIcons(app);
    }
    // app.component("AButtonGroup", Button.Group);
    return antdvUi;
  },
  set
};
