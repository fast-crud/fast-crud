import {
  computed,
  getCurrentInstance,
  mergeProps,
  onMounted,
  provide,
  resolveComponent,
  resolveDynamicComponent,
  ref,
  defineComponent,
  watch,
  shallowRef,
  PropType
} from "vue";
import _ from "lodash-es";
import { useUi } from "../../use";
import { ComponentEventContext, VModelProps } from "../../d";

function mergeEventHandles(target: any, eventName: string) {
  if (target[eventName] instanceof Array) {
    const events = target[eventName];
    target[eventName] = ($event: any) => {
      for (const event of events) {
        event($event);
      }
    };
  }
}
const htmlTags = ["div", "span", "a", "p", "pre", "li", "ol", "ul"];
/**
 * 组件动态渲染组件
 */
export default defineComponent({
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
      type: [String, Object]
    },
    /**
     * 组件参数，会与attrs合并
     */
    props: {},
    /**
     * 自定义render
     */
    render: {}
  },
  emits: ["update:dict", "update:modelValue", "mounted"],
  setup(props: any, ctx) {
    const { ui } = useUi();
    provide("get:scope", () => {
      return props.scope;
    });

    onMounted(() => {
      ctx.emit("mounted", props.scope);
    });

    const targetRef = ref();
    // 带事件的attrs
    const allAttrs = computed(() => {
      const vModel: VModelProps = {
        name: "modelValue",
        trim: false,
        number: false,
        transform: undefined
      };
      if (props.vModel) {
        if (typeof props.vModel === "string") {
          vModel.name = props.vModel;
        } else {
          _.merge(vModel, props.vModel);
        }
      }

      const modelValue = props.modelValue ?? (ui.type === "antdv" ? undefined : null);
      const attrs = {
        ref: targetRef,
        // scope: props.scope,
        // fix element display false bug
        [vModel.name]: modelValue,
        ...props.props
      };
      attrs["onUpdate:" + vModel.name] = (value: any) => {
        if (value) {
          if (vModel.trim) {
            value = value.trim();
          }
          if (vModel.number) {
            const tmp = Number(value);
            //判断tmp是否NaN
            if (isNaN(tmp)) {
            } else {
              value = tmp;
            }
          }
        }
        if (vModel.transform) {
          value = vModel.transform(value);
        }
        ctx.emit("update:modelValue", value);
      };

      const events: {
        [key: string]: (e: ComponentEventContext) => void;
      } = { ...props.events, ...props.on };
      _.forEach(events, (value, key) => {
        const handler = value;
        attrs[key] = ($event: any) => {
          return handler({ ...props.scope, $event });
        };
      });

      return attrs;
    });

    const childrenRender = () => {
      const children: any = {};
      const createChildren = (item: any, key: string) => {
        if (item instanceof Function) {
          children[key] = (scope: any) => {
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

    const inputCompRef = shallowRef();
    const isAsyncComponent = ref(false);
    watch(
      () => {
        return props.name;
      },
      (value) => {
        let inputComp = value || ui.input.name;
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
        inputCompRef.value = inputComp;
      },
      {
        immediate: true
      }
    );

    const childrenRendered = childrenRender;

    function getTargetRef() {
      if (isAsyncComponent.value) {
        return getTargetRefAsync();
      }
      return getTargetRefSync();
    }
    function getTargetRefSync() {
      return targetRef.value;
    }

    //异步获取组件实例,asyncComponent加载需要时间
    async function getTargetRefAsync() {
      const c = getTargetRefSync();
      if (c != null) {
        return c;
      }
      return new Promise((resolve, reject) => {
        getTargetRefDelay(resolve, reject, 0);
      });
    }
    function getTargetRefDelay(resolve: any, reject: any, count: number) {
      setTimeout(() => {
        const c = getTargetRefSync();
        if (c != null) {
          resolve(c);
          return;
        }
        count++;
        if (count > 20) {
          reject(new Error("异步组件加载超时"));
          return;
        }
        getTargetRefDelay(resolve, reject, count);
      }, 200);
    }

    ctx.expose({
      props,
      getTargetRefSync,
      getTargetRef,
      getTargetRefAsync
    });

    return () => {
      //merge 必须写在这里
      const merged = mergeProps(allAttrs.value, ctx.attrs);
      mergeEventHandles(merged, "onChange");
      mergeEventHandles(merged, "onBlur");
      if (props.render) {
        return props.render(merged);
      }
      const inputComp = inputCompRef.value;
      return <inputComp {...merged}>{childrenRendered()}</inputComp>;
    };
  }
});
