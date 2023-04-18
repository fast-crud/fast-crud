import { defineComponent, resolveDirective, resolveDynamicComponent, withDirectives } from "vue";
import { useUi } from "../../use";
import "./fs-loading.less";
/**
 * loading包装
 */
export default defineComponent({
  name: "FsLoading",
  props: {
    /**
     * 是否loading中
     */
    loading: {},

    icon: {}
  },
  setup(props) {
    const { ui } = useUi();

    return () => {
      if (!props.loading) {
        return null;
      }
      return (
        <div class="fs-loading">
          <fs-icon class={"fs-icon-spin"} icon={ui.icons.refresh}></fs-icon>
        </div>
      );
    };
  }
});
