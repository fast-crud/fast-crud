import { resolveDynamicComponent, defineComponent, getCurrentInstance } from "vue";
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
  setup(props) {
    const { ui } = useUi();
    if (ui.icon.isComponent) {
      const IconComp: any = resolveDynamicComponent(props.icon);
      return () => {
        return <IconComp />;
      };
    }
    return () => {
      return <i class={props.icon} />;
    };
  }
});
