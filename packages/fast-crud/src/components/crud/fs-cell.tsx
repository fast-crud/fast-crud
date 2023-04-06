import { useCompute } from "../../use/use-compute";
import { defineComponent, PropType } from "vue";
import { CellConditionalRender } from "/src/d";

/**
 * 单元格显示组件
 */
export default defineComponent({
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
    /**
     * 插槽
     */
    slots: {},

    /**
     * 条件渲染，符合条件的情况下优先渲染
     */
    conditionalRender: {
      type: Object as PropType<CellConditionalRender>
    }
  },
  setup(props: any) {
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
      const value = props.scope.value;
      if (title === true) {
        title = value;
      }
      const cellContentRender = (slot: any) => {
        return (
          <span class={"fs-cell"} title={title}>
            {slot}
          </span>
        );
      };
      if (props.conditionalRender && props.conditionalRender.match && props.conditionalRender.match(props.scope)) {
        //条件render
        return cellContentRender(props.conditionalRender.render(props.scope));
      } else if (props.slots) {
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
      // @ts-ignore
      return this.$refs.targetRef?.getTargetRef();
    }
  }
});
