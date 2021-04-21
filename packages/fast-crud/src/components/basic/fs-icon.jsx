import { resolveDynamicComponent } from "vue";

/**
 * icon组件
 * antdv的icon需要手动引入才能生效
 */
export default {
  name: "FsIcon",
  props: {
    /**
     * icon名称
     */
    icon: { require: true }
  },
  render() {
    if (this.$fsui.icon.isComponent) {
      const IconComp = resolveDynamicComponent(this.icon);
      return <IconComp />;
    }
    return <i class={this.icon} />;
  }
};
