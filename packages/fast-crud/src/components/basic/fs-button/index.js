import { resolveComponent, h } from "vue";
import "./style.less";
export default {
  name: "FsButton",
  props: {
    text: {
      type: String,
      default: "",
      required: false,
    },
    icon: {},
    circle: {},
  },
  render() {
    let icon = this.icon;
    let IconComp = null;
    if (icon && this.$fsui.icon.isComponent) {
      IconComp = resolveComponent(icon);
      icon = null;
    }
    const slots = {
      ...this.$slots,
      default: () => {
        const children = [];
        if (IconComp) {
          children.push(h(IconComp));
        }
        if (this.$slots.default) {
          children.push(this.$slots.default);
        } else if (this.text) {
          children.push(this.text);
        }
        return children;
      },
    };

    const isCircle = this.circle ? this.$fsui.icon.circle : {};

    const buttonComp = resolveComponent(this.$fsui.button.name);

    return h(
      buttonComp,
      {
        ...this.$attrs,
        ...isCircle,
        icon,
        class: {
          "fs-button": true,
          "is-thin": !this.text && !this.$slots.default,
        },
      },
      slots
    );
  },
};
