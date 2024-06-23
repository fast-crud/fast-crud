import { defineComponent } from "vue";
import "./fs-dialog.less";

/**
 * 对话框
 */
export default defineComponent({
  name: "FsDialog",
  props: {
    open: {},
    fullscreen: {},

    zIndex: {},

    appendTo: {}
  },
  emits: ["open", "opened", "mounted", "closed", "inner-change"],
  setup(props: any, ctx: any) {
    return () => {
      return "";
    };
  }
});
