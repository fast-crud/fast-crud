import { resolveComponent } from "vue";
export default {
  name: "FsIcon",
  props: {
    icon: { require: true },
  },
  render() {
    if (this.$fsui.icon.isComponent) {
      const IconComp = resolveComponent(this.icon);
      return <IconComp />;
    }
    return <i class={this.icon} />;
  },
};
