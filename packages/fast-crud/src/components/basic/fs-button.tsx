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
    icon: { type: [String, Object], default: "", required: false },
    /**
     * 右边的图标
     */
    iconRight: { type: [String, Object], default: "", required: false },
    /**
     * 是否圆形按钮，text需配置为null
     */
    circle: { type: Boolean, default: false, required: false }
  },
  render() {
    const { ui } = useUi();
    const icon: string | null | undefined | object = this.icon;
    const iconRight: string | null | undefined | object = this.iconRight;
    const iconRender = (icon, iconClass = "fs-button-icon") => {
      if (icon == null) {
        return;
      }
      if (typeof icon === "string") {
        return <fs-icon icon={icon} class={iconClass} />;
      } else {
        return <fs-icon {...icon} class={iconClass} />;
      }
    };
    const isIconSlot = ui.type !== "element";
    const isIconProp = ui.type === "element";
    let iconProp = undefined;
    const slots = {
      ...this.$slots
    };
    if ((icon && !isIconSlot && !isIconProp) || this.$slots.default || this.text || iconRight) {
      slots.default = () => {
        const children: any = [];
        if (icon && !isIconSlot && !isIconProp) {
          children.push(iconRender(icon));
        }
        if (this.$slots.default) {
          children.push(this.$slots.default());
        }
        if (this.text) {
          children.push(this.text);
        }
        if (iconRight) {
          children.push(iconRender(iconRight, "fs-button-icon-right"));
        }
        return children;
      };
    }
    if (icon) {
      if (isIconSlot && !slots["icon"]) {
        //@ts-ignore
        slots["icon"] = () => {
          return iconRender(icon);
        };
      } else if (isIconProp && !slots["icon"]) {
        //@ts-ignore
        iconProp = iconRender(icon);
      }
    }

    const isCircle = this.circle ? ui.button.circle : {};

    const buttonComp: any = resolveDynamicComponent(ui.button.name);

    const btnProps = {
      ...this.$attrs,
      ...isCircle,
      //icon,
      class: {
        "fs-button": true,
        "is-thin": !this.text && !this.$slots.default
      }
    };
    if (iconProp) {
      // @ts-ignore
      btnProps.icon = iconProp;
    }
    return h(buttonComp, btnProps, slots);
  }
});
