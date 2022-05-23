/**
 * 自定义render组件
 */
export default {
  name: "FsRender",
  functional: true,
  props: {
    renderFunc: {
      type: Function
    },
    scope: {
      type: Object
    }
  },
  setup() {},
  render() {
    return this.renderFunc(this.scope);
  }
};
