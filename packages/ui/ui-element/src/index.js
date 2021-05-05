import { ElMessage, ElNotification, ElMessageBox } from "element-plus";
import { uiContext } from "@fast-crud/fast-crud";
export default {
    install(){
        const ui = {
            name: "element",
            target: {
                Message: ElMessage,
                Notification: ElNotification,
                MessageBox: ElMessageBox
            }
        }
        uiContext.set(ui)
        console.log('element installed')
    }
}
