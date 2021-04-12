import { resolveDynamicComponent, withDirectives } from "vue";
export default {
  name: "FsLoading",
  props: {
    loading: { require: false }
  },
  render() {
    if (this.$fsui.loading.type === "component") {
      const LoadingComp = resolveDynamicComponent(this.$fsui.loading.name);
      return <LoadingComp />;
    }
    return withDirectives(<div style={"width:30px;height:30px;"} />, [[this.loading]]);
  }
};
