import { defineComponent } from "vue";
import utils from "../../utils";

/**
 * 插槽render组件
 */
export default defineComponent({
  name: "FsSlotRender",
  inheritAttrs: false,
  props: {
    /**
     * 插槽
     */
    slots: {
      type: Function
    },
    /**
     * 上下文
     */
    scope: {
      type: Object
    }
  },
  setup(props) {
    utils.trace("fs-slot-render");
    return () => {
      return props.slots(props.scope);
    };
  }
});
