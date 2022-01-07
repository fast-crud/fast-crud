<script lang="jsx">
import { useCompute } from "../../use/use-compute";
/**
 * 单元格显示组件
 */
export default {
  name: "FsCell",
  props: {
    item: {},
    /**
     * 获取scope参数方法
     */
    getScope: {
      type: Function
    },
    slots: {}
  },
  setup(props) {
    const { doComputed } = useCompute();
    const computedComponent = doComputed(props.item.component, props.getScope);

    return (props, ctx) => {
      if (props.slots) {
        return <span class={"fs-cell"}>{props.slots(props.getScope())}</span>;
      } else if (props.item.formatter) {
        return <span class={"fs-cell"}>{props.item.formatter(props.getScope())}</span>;
      } else if (props.item.cellRender) {
        return <span class={"fs-cell"}>{props.item.cellRender(props.getScope())}</span>;
      } else if (props.item.render) {
        console.warn("column.render 配置已废弃，请使用column.cellRender代替");
        return <span class={"fs-cell"}>{props.item.render(props.getScope())}</span>;
      } else if (props.item.component?.name) {
        if (computedComponent.value?.show === false) {
          return;
        }
        return <fs-component-render ref={"targetRef"} {...computedComponent.value} scope={props.getScope()} />;
      } else {
        return <span class={"fs-cell"}> {props.getScope().value}</span>;
      }
    };
  },
  methods: {
    getTargetRef() {
      return this.$refs.targetRef?.getTargetRef();
    }
  }
};
</script>
