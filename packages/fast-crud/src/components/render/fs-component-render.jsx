import {
  h,
  resolveDynamicComponent,
  getCurrentInstance,
  computed,
  mergeProps,
} from "vue";
import _ from "lodash-es";
import traceUtil from "../../utils/util.trace";

function mergeEventHandles(target, eventName) {
  if (target[eventName] instanceof Array) {
    const events = target[eventName];
    target[eventName] = ($event) => {
      for (let event of events) {
        event($event);
      }
    };
  }
}
const htmlTags = ["div", "span", "a", "p", "pre", "li", "ol", "ul"];
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
    const { proxy } = getCurrentInstance();
    function getComponentRef(key) {
      console.log("getComponentRef", proxy);
      return proxy.$refs[key];
    }
    const newScope = computed(() => {
      return {
        ...props.scope,
        getComponentRef,
      };
    });

    // 带事件的attrs
    const allAttrs = computed(() => {
      const vModel = props.vModel || "modelValue";
      const attrs = {
        ref: "targetRef",
        scope: props.scope,
        [vModel]: props.modelValue,
      };
      attrs["onUpdate:" + vModel] = (value) => {
        ctx.emit("update:modelValue", value);
      };

      const events = { ...props.events, ...props.on };
      _.forEach(events, (value, key) => {
        const handler = value;
        attrs[key] = ($event) => {
          return handler({ ...newScope.value, $event });
        };
      });
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
    // eslint-disable-next-line vue/no-setup-props-destructure
    let inputComp = props.name || proxy.$fsui.input.name;
    if (!htmlTags.includes(inputComp)) {
      inputComp = resolveDynamicComponent(inputComp);
    }
    const children = childrenRender();
    return () => {
      const oldDict = ctx.attrs.dict;
      const props = mergeProps(allAttrs.value, ctx.attrs);
      const newDict = props.dict;
      console.log("render dict", oldDict, newDict, oldDict === newDict);
      mergeEventHandles(props, "onChange");
      mergeEventHandles(props, "onBlur");
      return h(inputComp, props, children);
    };
  },
};
