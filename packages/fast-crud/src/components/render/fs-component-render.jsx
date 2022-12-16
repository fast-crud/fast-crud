import {
  computed,
  getCurrentInstance,
  mergeProps,
  onMounted,
  provide,
  resolveComponent,
  resolveDynamicComponent,
  ref
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
/**
 * 组件动态渲染组件
 */
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
      type: String
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

    const isAsyncComponent = ref(false);
    if (!htmlTags.includes(inputComp)) {
      inputComp = resolveDynamicComponent(inputComp);
      if (typeof inputComp === "string") {
        inputComp = resolveComponent(inputComp);
      }
      if (inputComp?.name === "AsyncComponentWrapper") {
        //如果是异步组件
        isAsyncComponent.value = true;
      }
    }
    const childrenRendered = childrenRender;
    return {
      allAttrs,
      isAsyncComponent,
      childrenRendered,
      inputComp
    };
  },
  methods: {
    getTargetRef() {
      if (this.isAsyncComponent) {
        return this.getTargetRefAsync();
      }
      return this.getTargetRefSync();
    },
    getTargetRefSync() {
      return this.$refs.targetRef;
    },
    //异步获取组件实例,asyncComponent加载需要时间
    async getTargetRefAsync() {
      const c = this.getTargetRefSync();
      if (c != null) {
        return c;
      }
      return new Promise((resolve, reject) => {
        this.getTargetRefDelay(resolve, reject, 0);
      });
    },
    getTargetRefDelay(resolve, reject, count) {
      setTimeout(() => {
        const c = this.getTargetRefSync();
        if (c != null) {
          resolve(c);
          return;
        }
        count++;
        if (count > 10) {
          reject(new Error("异步组件加载超时"));
          return;
        }
        this.getTargetRefDelay(resolve, reject, count);
      }, 200);
    }
  },
  render() {
    //merge 必须写在这里
    const merged = mergeProps(this.allAttrs, this.$attrs);
    mergeEventHandles(merged, "onChange");
    mergeEventHandles(merged, "onBlur");
    const inputComp = this.inputComp;
    return <inputComp {...merged}>{this.childrenRendered()}</inputComp>;
  }
};
