import { h, resolveDynamicComponent, getCurrentInstance, computed } from "vue";
import _ from "lodash-es";
import traceUtil from "../../utils/util.trace";
export default {
  name: "FsComponentRender",
  inheritAttrs: false,
  props: {
    modelValue: {},
    name: {
      type: String,
    },
    children: {
      type: Object,
    },
    on: {
      type: Object,
    },
    events: {
      type: Object,
    },
    scope: {
      type: Object,
    },
    vModel: {
      type: String,
      Object,
    },
    //模式：row,search,add,edit,view,自定义
    mode: {},
  },
  emits: ["update:dict", "update:modelValue"],
  setup(props, ctx) {
    traceUtil.trace("fs-component-render");
    const newScope = computed(() => {
      return {
        ...props.scope,
      };
    });

    const computedModelValue = computed(() => {
      return props.modelValue;
    });
    const vModel = computed(() => {
      return props.vModel || "modelValue";
    });

    // 带事件的attrs
    const allAttrs = computed(() => {
      const attrs = {
        ref: "targetRef",
        ...ctx.attrs,
        scope: props.scope,
        modelValue: props.modelValue,
      };
      attrs["onUpdate:" + vModel.value] = (value) => {
        ctx.emit("update:modelValue", value);
      };

      const events = { ...props.events, ...props.on };
      _.forEach(events, (value, key) => {
        const handler = value;
        attrs[key] = ($event) => {
          return handler({ ...newScope.value, $event });
        };
      });

      _.set(attrs, vModel.value, computedModelValue.value);
      return attrs;
    });

    const childrenRender = () => {
      const children = {};
      _.forEach(props.children, (item, key) => {
        if (item instanceof Function) {
          children[key] = (scope) => {
            return item({ ...newScope.value, scope });
          };
        } else {
          children[key] = () => {
            return item;
          };
        }
      });
      return children;
    };
    const { proxy } = getCurrentInstance();
    // eslint-disable-next-line vue/no-setup-props-destructure
    let inputComp = props.name || proxy.$fsui.input.name;
    if (inputComp !== "div" || inputComp !== "span") {
      inputComp = resolveDynamicComponent(inputComp);
    }
    const children = childrenRender();
    return () => {
      return h(inputComp, allAttrs.value, children);
    };
  },
};
