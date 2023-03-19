import { message, notification, Modal } from "ant-design-vue";
import { uiContext } from "@fast-crud/ui-interface";
import setupIcons from "./icons";
import { Antdv } from "./antdv";

export * from "./antdv";
export default {
  install(app: any) {
    const antdvUi = new Antdv({
      Message: message,
      Notification: notification,
      MessageBox: Modal
    });
    uiContext.set(antdvUi);

    setupIcons(app);
    return antdvUi;
  }
};
