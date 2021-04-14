import { h } from "vue";
import traceUtil from "../../utils/util.trace";
export default {
  name: "FsSlotRender",
  inheritAttrs: false,
  props: {
    slots: {
      type: Function
    },
    scope: {
      type: Object
    }
  },
  setup(props) {
    traceUtil.trace("fs-slot-render");
    return () => {
      return props.slots(props.scope);
    };
  }
};
