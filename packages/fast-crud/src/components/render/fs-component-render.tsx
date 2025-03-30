import {
  computed,
  defineComponent,
  markRaw,
  mergeProps,
  onMounted,
  provide,
  Ref,
  ref,
  resolveComponent,
  unref
} from "vue";
import { forEach, camelCase } from "lodash-es";
import { useMerge, useUi } from "../../use";
import { ComponentEventContext, VModelProps } from "../../d";
import utils from "../../utils";

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
    render: {},

    /**
     * 当输入框的值上报为undefine时，转为null
     */
    undefineToNull: {
      type: Boolean,
      default: true
    }
  },
  emits: ["update:dict", "update:modelValue", "mounted"],
  setup(props: any, ctx) {
    utils.trace("fs-component-render");
    const { ui } = useUi();
    const { merge } = useMerge();
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
          merge(vModel, props.vModel);
        }
      }

      const modelValue = props.modelValue ?? (ui.type === "antdv" ? undefined : null);
      const onUpdateModelValueName = "onUpdate:" + vModel.name;
      const attrs = {
        ref: targetRef,
        // scope: props.scope,
        // fix element display false bug
        [vModel.name]: modelValue,
        [onUpdateModelValueName]: (value: any) => {
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
          if (value === undefined && props.undefineToNull) {
            value = null;
          }
          ctx.emit("update:modelValue", value);
        },
        ...props.props
      };

      const events: {
        [key: string]: (e: ComponentEventContext) => void;
      } = { ...props.events, ...props.on };

      forEach(events, (value, key) => {
        const handler = value;
        if (!key.startsWith("on")) {
          key = camelCase("on_" + key);
        }
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
      forEach(props.children, createChildren);
      forEach(props.slots, createChildren);
      return children;
    };

    type InputCompType = {
      isAsyncComponent: boolean;
      component: any;
    };
    const computedInputComp: Ref<InputCompType> = computed(() => {
      const res: InputCompType = {
        isAsyncComponent: false,
        component: unref(props.name) || ui.input.name
      };
      let inputComp = res.component;
      if (!htmlTags.includes(inputComp)) {
        if (typeof inputComp === "string") {
          inputComp = resolveComponent(inputComp);
        }
        if (inputComp?.name === "AsyncComponentWrapper") {
          //如果是异步组件
          res.isAsyncComponent = true;
        }
      }
      res.component = inputComp;
      return res;
    });

    const childrenRendered = childrenRender;

    function getTargetRef() {
      if (computedInputComp.value.isAsyncComponent) {
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
        return props.render({ ...props.scope, attrs: merged });
      }
      const inputComp = markRaw(computedInputComp.value.component);
      return <inputComp {...merged}>{childrenRendered()}</inputComp>;
    };
  }
});
