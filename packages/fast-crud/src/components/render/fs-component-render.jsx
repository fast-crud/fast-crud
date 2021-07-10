import {
  computed,
  getCurrentInstance,
  mergeProps,
  onMounted,
  provide,
  resolveComponent,
  resolveDynamicComponent
} from "vue";
import _ from "lodash-es";
import { useUi } from "../../use";

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
    /**
     * modelValue
     */
    modelValue: {},
    /**
     * 组件名称
     */
    name: {},
    /**
     * 插槽
     */
    slots: {
      type: Object
    },
    /**
     * 子元素，同slots
     */
    children: {
      type: Object
    },
    /**
     * 事件监听
     */
    on: {
      type: Object
    },
    /**
     * 同 on
     */
    events: {
      type: Object
    },
    /**
     * 上下文scope
     */
    scope: {
      type: Object
    },
    /**
     * modelValue的属性名
     */
    vModel: {
      type: String,
      Object
    },
    /**
     * 组件参数，会与attrs合并
     */
    props: {}
  },
  emits: ["update:dict", "update:modelValue"],
  setup(props, ctx) {
    const { proxy } = getCurrentInstance();
    const { ui } = useUi();
    provide("get:scope", () => {
      return props.scope;
    });

    if (props.onMounted) {
      onMounted(() => {
        props.onMounted(props.scope);
      });
    }

    // 带事件的attrs
    const allAttrs = computed(() => {
      const vModel = props.vModel || "modelValue";
      const modelValue = props.modelValue ?? (ui.type === "antdv" ? undefined : null);
      const attrs = {
        ref: "targetRef",
        // scope: props.scope,
        // fix element display false bug
        [vModel]: modelValue,
        ...props.props
      };
      attrs["onUpdate:" + vModel] = (value) => {
        ctx.emit("update:modelValue", value);
      };

      const events = { ...props.events, ...props.on };
      _.forEach(events, (value, key) => {
        const handler = value;
        attrs[key] = ($event) => {
          return handler({ ...props.scope, $event });
        };
      });

      return attrs;
    });

    const childrenRender = () => {
      const children = {};
      let createChildren = (item, key) => {
        if (item instanceof Function) {
          children[key] = (scope) => {
            return item({ ...props.scope, scope });
          };
        } else {
          children[key] = () => {
            return item;
          };
        }
      };
      _.forEach(props.children, createChildren);
      _.forEach(props.slots, createChildren);
      return children;
    };
    // eslint-disable-next-line vue/no-setup-props-destructure
    let inputComp = props.name || proxy.$fsui.input.name;

    if (!htmlTags.includes(inputComp)) {
      inputComp = resolveDynamicComponent(inputComp);
      if (typeof inputComp === "string") {
        inputComp = resolveComponent(inputComp);
      }
    }
    const children = childrenRender();
    return () => {
      //merge 必须写在这里
      const merged = mergeProps(allAttrs.value, ctx.attrs);
      mergeEventHandles(merged, "onChange");
      mergeEventHandles(merged, "onBlur");
      return <inputComp {...merged}>{children}</inputComp>;
    };
  },
  methods: {
    getTargetRef() {
      return this.$refs.targetRef;
    }
  }
};
