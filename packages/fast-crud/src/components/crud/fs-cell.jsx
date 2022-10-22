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
     * 获取scope参数方法
     */
    getScope: {
      type: Function
    },
    slots: {}
  },
  setup(props) {
    const { doComputed } = useCompute();
    const computedPropsComponent = computed(() => {
      return props.item.component;
    });
    const computedComponent = doComputed(computedPropsComponent, props.getScope);
    const cellRender = (props, ctx) => {
      let title = props.item.showTitle;
      if (title === true) {
        title = props.getScope().value;
      }
      const cellContentRender = (slot) => {
        return (
          <span className={"fs-cell"} title={title}>
            {slot}
          </span>
        );
      };
      if (props.slots) {
        return cellContentRender(props.slots(props.getScope()));
      } else if (props.item.formatter) {
        return cellContentRender(props.item.formatter(props.getScope()));
      } else if (props.item.cellRender) {
        return cellContentRender(props.item.cellRender(props.getScope()));
      } else if (props.item.render) {
        console.warn("column.render 配置已废弃，请使用column.cellRender代替");
      } else if (computedComponent.value?.name) {
        if (computedComponent.value?.show === false) {
          return;
        }
        return (
          <fs-component-render title={title} ref={"targetRef"} {...computedComponent.value} scope={props.getScope()} />
        );
      } else {
        return cellContentRender(props.getScope().value);
      }
    };

    return cellRender;
  },
  methods: {
    getTargetRef() {
      return this.$refs.targetRef?.getTargetRef();
    }
  }
};
