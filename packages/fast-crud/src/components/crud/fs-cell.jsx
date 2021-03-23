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
    const computedComponent = doComputed(props.component, props.getScope);

    return () => {
      if (computedComponent.value.show === false) {
        return;
      }
      const newScope = props.getScope();
      if (computedComponent.value.render) {
        return computedComponent.value.render(newScope);
      } else {
        return (
          <fs-component-render
            ref={"targetRef"}
            {...computedComponent.value}
            scope={newScope}
          />
        );
      }
    };
  },
  methods: {
    getTargetRef() {
      return this.$refs.targetRef?.getTargetRef();
    },
  },
};
