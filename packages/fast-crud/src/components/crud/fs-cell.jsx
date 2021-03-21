import { useCompute } from "../../use/use-compute";
export default {
  name: "FsCell",
  props: {
    component: {},
    getScope: {
      type: Function,
    },
  },
  setup(props) {
    const { doComputed } = useCompute();
    // eslint-disable-next-line vue/no-setup-props-destructure
    const oldDict = props.component.dict;
    const computedComponent = doComputed(props.component, props.getScope);
    const newDict = computedComponent.value.dict;

    // const component = ComputeValue.buildBindProps(
    //   props.component,
    //   props.getScope
    // );
    return () => {
      if (computedComponent.value.show === false) {
        return;
      }
      const newScope = props.getScope();
      if (computedComponent.value.render) {
        return computedComponent.value.render(newScope);
      } else {
        return (
          <fs-component-render {...computedComponent.value} scope={newScope} />
        );
      }
    };
  },
};
