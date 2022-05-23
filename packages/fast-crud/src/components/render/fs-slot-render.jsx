/**
 * 插槽render组件
 */
export default {
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
    return () => {
      return props.slots(props.scope);
    };
  }
};
