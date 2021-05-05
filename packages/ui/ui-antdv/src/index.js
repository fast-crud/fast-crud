import {message, notification, Modal} from "ant-design-vue";
import {uiContext} from "@fast-crud/fast-crud";

export default {
    install() {
        const ui = {
            name: "antdv",
            target: {
                Message: message,
                Notification: notification,
                MessageBox: Modal
            }
        }
        uiContext.set(ui)
        console.log('antdv installed')
    }
}
