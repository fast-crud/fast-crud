import { resolveDynamicComponent, h } from "vue";
import "./style.less";

/**
 * 按钮，支持el-button/a-button的配置
 */
export default {
  name: "FsButton",
  props: {
    /**
     * 文字
     */
    text: {
      type: String,
      default: "",
      required: false
    },
    /**
     * 图标
     */
    icon: {},
    /**
     * 是否圆形按钮，text需配置为null
     */
    circle: {}
  },
  render() {
    let icon = this.icon;
    let IconComp = null;
    if (icon && this.$fsui.icon.isComponent) {
      IconComp = resolveDynamicComponent(icon);
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
          children.push(this.$slots.default());
        }
        if (this.text) {
          children.push(this.text);
        }
        return children;
      }
    };

    const isCircle = this.circle ? this.$fsui.icon.circle : {};

    const buttonComp = resolveDynamicComponent(this.$fsui.button.name);

    return h(
      buttonComp,
      {
        ...this.$attrs,
        ...isCircle,
        icon,
        class: {
          "fs-button": true,
          "is-thin": !this.text && !this.$slots.default
        }
      },
      slots
    );
  }
};
