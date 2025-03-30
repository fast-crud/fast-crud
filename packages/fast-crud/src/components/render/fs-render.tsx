import { defineComponent } from "vue";
import utils from "../../utils";
/**
 * 自定义render组件
 */
export default defineComponent({
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
  setup() {
    utils.trace("fs-render");
  },
  render() {
    return this.renderFunc(this.scope);
  }
});
