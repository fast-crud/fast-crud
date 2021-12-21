import { useMessage, useDialog, useNotification } from "naive-ui";
import { uiContext } from "@fast-crud/fast-crud";
import setupIcons from "./icons";
import { Naive } from "./naive";
export default {
  install(app) {
    const message = useMessage();
    const notification = useNotification();
    const dialog = useDialog();
    const naiveUi = new Naive({
      message: message,
      notification: notification,
      messageBox: dialog
    });
    uiContext.set(naiveUi);

    setupIcons(app);
    console.log("naive ui installed");
  }
};
