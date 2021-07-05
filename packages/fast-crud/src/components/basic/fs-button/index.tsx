import { resolveDynamicComponent, defineComponent, h } from "vue";
import "./style.less";
import { useUi } from "../../../use";

/**
 * 按钮，支持el-button/a-button的配置
 */
export default defineComponent({
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
    icon: { type: String, default: "", required: false },
    /**
     * 是否圆形按钮，text需配置为null
     */
    circle: { type: Boolean, default: false, required: false }
  },
  render() {
    const { ui } = useUi();
    const icon: string | null | undefined = this.icon;
    const slots = {
      ...this.$slots,
      default: () => {
        const children: any = [];
        if (icon) {
          children.push(<fs-icon icon={icon} />);
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

    const isCircle = this.circle ? ui.icon.circle : {};

    const buttonComp: any = resolveDynamicComponent(ui.button.name);

    return h(
      buttonComp,
      {
        ...this.$attrs,
        ...isCircle,
        //icon,
        class: {
          "fs-button": true,
          "is-thin": !this.text && !this.$slots.default
        }
      },
      slots
    );
  }
});
