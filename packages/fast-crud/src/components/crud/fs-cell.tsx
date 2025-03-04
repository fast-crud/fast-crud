import { useCompute } from "../../use/use-compute";
import { computed, defineComponent, isShallow, PropType, ref } from "vue";
import { ConditionalRenderProps } from "../../d";
import { toString } from "lodash-es";
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
      type: Object as PropType<ConditionalRenderProps<any>>
    }
  },
  setup(props: any, ctx) {
    const { doComputed } = useCompute();
    const computedPropsComponent = () => {
      return props.item.component;
    };
    const getScope = () => {
      return props.scope;
    };

    const computedComponent = doComputed(computedPropsComponent, getScope);

    const targetRef = ref();

    function getTargetRef() {
      return targetRef.value.getTargetRef();
    }

    ctx.expose({
      getTargetRef,
      targetRef
    });

    const computedTitle = computed(() => {
      let title = props.item.showTitle;
      const value = props.scope.value;
      if (title === true) {
        title = value;
      }
      return title;
    });
    const computedCellContentRender = computed(() => {
      const cellContentRender = (slot: any) => {
        return (
          <span class={"fs-cell"} title={computedTitle.value}>
            {slot}
          </span>
        );
      };
      return cellContentRender;
    });

    return () => {
      const value = props.scope.value;
      const cellContentRender = computedCellContentRender.value;
      const scope = { ...props.scope, props: props.item };
      const conditionalRender = props.item.conditionalRender ?? props.conditionalRender;
      if (conditionalRender && conditionalRender.match && conditionalRender.match(scope)) {
        //条件render
        return cellContentRender(conditionalRender.render(scope));
      } else if (props.slots) {
        return cellContentRender(props.slots(scope));
      } else if (props.item.formatter) {
        return cellContentRender(props.item.formatter(scope));
      } else if (props.item.cellRender) {
        return cellContentRender(props.item.cellRender(scope));
      } else if (props.item.render) {
        console.warn("column.render 配置已废弃，请使用column.cellRender代替");
      } else if (computedComponent.value?.name) {
        if (computedComponent.value?.show === false) {
          return;
        }
        return (
          <fs-component-render title={computedTitle.value} ref={targetRef} {...computedComponent.value} scope={scope} />
        );
      } else {
        return cellContentRender(toString(value));
      }
    };
  }
});
