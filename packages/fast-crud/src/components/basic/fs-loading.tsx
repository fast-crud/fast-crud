import { defineComponent, resolveDynamicComponent, withDirectives } from "vue";
import { useUi } from "../../use";

/**
 * loading包装
 */
export default defineComponent({
  name: "FsLoading",
  props: {
    /**
     * 是否loading中
     */
    loading: {}
  },
  render() {
    const { ui } = useUi();
    if (ui.loading.type === "component") {
      const LoadingComp = resolveDynamicComponent(ui.loading.name);
      // @ts-ignore
      return <LoadingComp />;
    }
    return withDirectives(<div style={"width:30px;height:30px;"} />, [[this.loading]]);
  }
});
