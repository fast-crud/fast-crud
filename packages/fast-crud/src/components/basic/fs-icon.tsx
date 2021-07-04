import { resolveDynamicComponent, defineComponent, computed } from "vue";
import { useUi } from "../../use/use-ui";
import FsIconify from "./fs-iconify.vue";
/**
 * icon组件
 * antdv的icon需要手动引入才能生效
 */
export default defineComponent({
  name: "FsIcon",
  components: { FsIconify },
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
    const computedRenderFunc = computed(() => {
      if (props.icon?.indexOf(":") >= 0) {
        const IconComp: any = resolveDynamicComponent("FsIconify");
        //如果是iconify图标
        return () => {
          return <IconComp icon={props.icon} />;
        };
      }
      //ui内置图标
      if (ui.icon.isComponent) {
        const IconComp: any = resolveDynamicComponent(props.icon);
        return () => {
          return <IconComp />;
        };
      }
      return () => {
        return <i class={props.icon} />;
      };
    });
    //render icon
    return () => {
      return computedRenderFunc.value();
    };
  }
});
