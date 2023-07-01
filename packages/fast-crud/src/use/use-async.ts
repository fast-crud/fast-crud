import { createVNode, Ref, ref, render, resolveDynamicComponent } from "vue";
import logger from "../utils/util.log";

const FsAsyncLibStore: any = {};

const FsAsyncComponentRef: Ref = ref({});

function registerAsyncLib(name: string) {
  const resolveComponent = resolveDynamicComponent(name);
  FsAsyncLibStore[name] = resolveComponent;
}
function getAsyncLib(name: string) {
  const lib = FsAsyncLibStore[name];
  if (lib == null) {
    logger.error(`[fast-crud] async lib ${name} 还未注册 ， 请先通过registerAsyncLib注册`);
    return;
  }
  return lib;
}
let _appContext: any = null;
export type CreateAsyncComponentOptions = {
  name: string;
  component?: any;
  props: any;
};
export type AsyncComponentInstance = {
  vm: {
    getLib(): any;
  };
};
export function setupAppContext(context: any) {
  _appContext = context;
}
export function getAppContext() {
  return _appContext;
}
async function createAsyncComponent(opts: CreateAsyncComponentOptions): Promise<AsyncComponentInstance> {
  const resolveComponent = getAsyncLib(opts.name);
  const name = opts.name;
  return new Promise((resolve, reject) => {
    let instance: any = FsAsyncComponentRef.value[name];
    if (instance != null) {
      instance.triggers.push(() => {
        resolve(instance);
      });
    }

    instance = FsAsyncComponentRef.value[name] = { name, triggers: [] };

    const container = document.createElement("div");

    const vNode = createVNode(resolveComponent, {
      ...opts.props,
      onReady: (vm: any) => {
        instance.vm = vm;
        resolve(instance);
        instance.triggers.forEach((trigger: any) => {
          trigger();
        });
      },
      onError: (err: any) => {
        logger.error("load async component err: ", err);
        reject(err);
        document.body.removeChild(container);
      }
    });
    vNode.appContext = _appContext; // || message._appContext;
    render(vNode, container);
    const appendTo = document.body;
    // instances will remove this item when close function gets called. So we do not need to worry about it.
    appendTo.appendChild(container);
    // const vm = vNode.component!;
    // instance.vm = vm;
    instance.vNode = vNode;
    // instance.props = (vNode.component as any).props;
  });
}

export type LoadAsyncLibOptions = {
  name: string;
  component?: any;
};
async function loadAsyncLib<T = any>(opts: LoadAsyncLibOptions) {
  const { vm } = await createAsyncComponent({ name: opts.name, props: {} });
  return vm.getLib() as T;
}
export function useAsync() {
  return {
    getAppContext,
    setupAppContext,
    createAsyncComponent,
    loadAsyncLib,
    registerAsyncLib,
    getAsyncLib
  };
}
