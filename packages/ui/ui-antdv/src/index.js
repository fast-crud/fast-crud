import {message, notification, Modal} from "ant-design-vue";
import {uiContext} from "@fast-crud/fast-crud";
import setupIcons from './icons'
export default {
    install(app) {
        const ui = {
            name: "antdv",
            target: {
                Message: message,
                Notification: notification,
                MessageBox: Modal
            }
        }
        uiContext.set(ui)

        setupIcons(app)
        console.log('antdv installed')
    }
}
