import { resolveDynamicComponent, defineComponent, computed } from "vue";
import { useUi } from "../../use/use-ui";
/**
 * icon组件
 * antdv的icon需要手动引入才能生效
 */
export default defineComponent({
  name: "FsIcon",
  props: {
    /**
     * icon名称
     */
    icon: {
      type: String,
      default: undefined,
      require: true
    }
  },
  setup(props, ctx) {
    const { ui } = useUi();
    const computedRenderFunc = computed(() => {
      if (props.icon && props.icon?.indexOf(":") >= 0) {
        if (props.icon.startsWith("svg:")) {
          const IconComp: any = resolveDynamicComponent("FsIconSvg");
          //如果是svg图标
          return () => {
            //@ts-ignore
            const name = props.icon.replace("svg:", "");
            return <IconComp icon={name} {...ctx.attrs} />;
          };
        }

        const IconComp: any = resolveDynamicComponent("FsIconify");
        //如果是iconify图标
        return () => {
          return <IconComp icon={props.icon} {...ctx.attrs} />;
        };
      }
      //使用ui内置图标
      if (ui.icon.isComponent) {
        const IconComp: any = resolveDynamicComponent(props.icon);
        return () => {
          return <IconComp {...ctx.attrs} />;
        };
      } else {
        const IconComp: any = resolveDynamicComponent(props.icon);
        return () => {
          return (
            <el-icon {...ctx.attrs}>
              <IconComp />
            </el-icon>
          );
        };
      }
      return () => {
        return <i class={props.icon} {...ctx.attrs} />;
      };
    });
    //render icon
    return () => {
      return computedRenderFunc.value();
    };
  }
});
