<script lang="tsx">
import { resolveDynamicComponent, defineComponent, h } from "vue";
import { useUi } from "../../use";

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
    let iconRender = ()=>{
      return <fs-icon icon={icon} />;
    }
    const isIconSlot = ui.type !== "element";
    const slots = {
      ...this.$slots,
      default: () => {
        const children: any = [];
        if (icon && !isIconSlot) {
          children.push(iconRender);
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
      }
    };
    if (icon && isIconSlot && !slots["icon"]) {
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
</script>

<style lang="less">
.fs-button {
  &.is-thin {
    &.el-button--small,
    &.el-button--small.is-round {
      padding: 9px 9px;
    }
    &.el-button--mini,
    &.el-button--mini.is-round {
      padding: 7px 7px;
    }
    &.el-button [class*="el-icon-"] + span {
      margin-left: 0;
    }
  }

  &.ant-btn {
    display: inline-flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }
  //&.ant-btn > .anticon {
  //  line-height: 0;
  //  margin-left: 2px;
  //  margin-right: 2px;
  //}
}
</style>
