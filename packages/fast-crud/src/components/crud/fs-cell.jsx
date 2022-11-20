import { useCompute } from "../../use/use-compute";
import { computed, render, withDirectives } from "vue";
/**
 * 单元格显示组件
 */
export default {
  name: "FsCell",
  props: {
    item: {},
    /**
     * scope
     */
    scope: {
      default() {
        return {};
      }
    },
    slots: {}
  },
  setup(props) {
    const { doComputed } = useCompute();
    const computedPropsComponent = () => {
      return props.item.component;
    };
    const getScope = () => {
      return props.scope;
    };
    const computedComponent = doComputed(computedPropsComponent, getScope);
    return () => {
      let title = props.item.showTitle;
      let value = props.scope.value;
      if (title === true) {
        title = value;
      }
      const cellContentRender = (slot) => {
        return (
          <span className={"fs-cell"} title={title}>
            {slot}
          </span>
        );
      };
      if (props.slots) {
        return cellContentRender(props.slots(props.scope));
      } else if (props.item.formatter) {
        return cellContentRender(props.item.formatter(props.scope));
      } else if (props.item.cellRender) {
        return cellContentRender(props.item.cellRender(props.scope));
      } else if (props.item.render) {
        console.warn("column.render 配置已废弃，请使用column.cellRender代替");
      } else if (computedComponent.value?.name) {
        if (computedComponent.value?.show === false) {
          return;
        }
        return <fs-component-render title={title} ref={"targetRef"} {...computedComponent.value} scope={props.scope} />;
      } else {
        return cellContentRender(value);
      }
    };
  },
  methods: {
    getTargetRef() {
      return this.$refs.targetRef?.getTargetRef();
    }
  }
};
