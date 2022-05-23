import { resolveDynamicComponent, defineComponent, h } from "vue";
import { useUi } from "../../use";
import "./fs-button.less";

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
     * 右边的图标
     */
    iconRight: { type: String, default: "", required: false },
    /**
     * 是否圆形按钮，text需配置为null
     */
    circle: { type: Boolean, default: false, required: false }
  },
  render() {
    const { ui } = useUi();
    const icon: string | null | undefined = this.icon;
    const iconRight: string | null | undefined = this.iconRight;
    const iconRender = () => {
      return <fs-icon icon={icon} />;
    };
    const isIconSlot = ui.type !== "element";
    const slots = {
      ...this.$slots
    };
    if ((icon && !isIconSlot) || this.$slots.default || this.text || iconRight) {
      slots.default = () => {
        const children: any = [];
        if (icon && !isIconSlot) {
          children.push(iconRender());
        }
        if (this.$slots.default) {
          children.push(this.$slots.default());
        }
        if (this.text) {
          children.push(this.text);
        }
        if (iconRight) {
          children.push(<fs-icon icon={iconRight} />);
        }
        return children;
      };
    }
    if (icon && isIconSlot && !slots["icon"]) {
      //@ts-ignore
      slots["icon"] = iconRender;
    }

    const isCircle = this.circle ? ui.button.circle : {};

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
