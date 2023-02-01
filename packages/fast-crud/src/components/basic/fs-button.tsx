import { resolveDynamicComponent, defineComponent, h, computed } from "vue";
import { useUi } from "../../use";
import "./fs-button.less";
import _ from "lodash-es";
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
    circle: { type: Boolean, default: false, required: false },

    /**
     * tooltip配置，为空不显示tooltip
     */
    tooltip: {
      type: Object,
      default: undefined
    }
  },
  setup(props, ctx) {
    const { ui } = useUi();
    const iconRender = (icon: any, iconClass = "fs-button-icon") => {
      if (icon == null) {
        return;
      }
      if (typeof icon === "string") {
        return <fs-icon icon={icon} class={iconClass} />;
      } else {
        return <fs-icon {...icon} class={iconClass} />;
      }
    };
    const renderBtn = () => {
      const icon: string | null | undefined | object = props.icon;
      const iconRight: string | null | undefined | object = props.iconRight;

      const isIconSlot = ui.type !== "element";
      const isIconProp = !isIconSlot;
      let iconProp = undefined;
      const slots = {
        ...ctx.slots
      };
      if ((icon && !isIconSlot && !isIconProp) || ctx.slots.default || props.text || iconRight) {
        slots.default = () => {
          const children: any = [];
          if (icon && !isIconSlot && !isIconProp) {
            children.push(iconRender(icon));
          }
          if (ctx.slots.default) {
            children.push(ctx.slots.default());
          }
          if (props.text) {
            children.push(props.text);
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

      const isCircle = props.circle ? ui.button.circle : {};

      const buttonComp: any = resolveDynamicComponent(ui.button.name);

      const btnProps = {
        ...ctx.attrs,
        ...isCircle,
        //icon,
        class: {
          "fs-button": true,
          "is-thin": !props.text && !ctx.slots.default
        }
      };
      if (iconProp) {
        // @ts-ignore
        btnProps.icon = iconProp;
      }
      return h(buttonComp, btnProps, slots);
    };

    if (!props.tooltip) {
      return renderBtn;
    }

    // render tooltip
    const tooltipComp: any = resolveDynamicComponent(ui.tooltip.name);

    const computeTooltipProps = computed(() => {
      return _.omit(props.tooltip, "slots");
    });
    const triggerSlotName = ui.tooltip.trigger;
    return () => {
      const slots = {
        ...props.tooltip?.slots,
        [triggerSlotName]: renderBtn
      };
      return <tooltipComp {...computeTooltipProps.value}>{slots}</tooltipComp>;
    };
  }
});
