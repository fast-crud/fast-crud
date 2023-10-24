import { defineComponent } from "vue";

/**
 * 自定义render组件
 */
export default defineComponent({
  functional: true,
  name: "UiRender",
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
});
