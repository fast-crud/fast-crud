<script lang="tsx">
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
  setup(props) {
    const { ui } = useUi();
    const computedRenderFunc = computed(() => {
      if (props.icon && props.icon?.indexOf(":") >= 0) {

        if(props.icon.startsWith("svg:")){
          const IconComp: any = resolveDynamicComponent("FsIconSvg");
          //如果是svg图标
          return () => {
            //@ts-ignore
            const name = props.icon.replace("svg:","")
            return <IconComp icon={name} />;
          };
        }

        const IconComp: any = resolveDynamicComponent("FsIconify");
        //如果是iconify图标
        return () => {
          return <IconComp icon={props.icon} />;
        };
      }
      //使用ui内置图标
      if (ui.icon.isComponent) {
        const IconComp: any = resolveDynamicComponent(props.icon);
        return () => {
          return <IconComp />;
        };
      } else {
        const IconComp: any = resolveDynamicComponent(props.icon);
        return () => {
          return (
            <el-icon>
              <IconComp />
            </el-icon>
          );
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
</script>
