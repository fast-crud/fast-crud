import { createVNode, render, resolveComponent } from "vue";

let appContext: any = null;
let instance: any = null;
function setAppContext(context: any) {
  appContext = context;
}

async function load(): Promise<any> {
  return new Promise((resolve, reject) => {
    if (instance != null) {
      resolve(instance.vm.exposed);
    }
    const container = document.createElement("div");

    const FsAsyncLoader = resolveComponent("FsAsyncLoader");
    let vm: any = null;
    const vNode = createVNode(FsAsyncLoader, {
      onReady() {
        instance = {
          vNode,
          vm,
          props: (vNode.component as any).props
        };
        resolve(instance.vm.exposed);
      }
    });
    vNode.appContext = appContext; // || message._context;

    render(vNode, container);
    const appendTo = document.body;
    // instances will remove this item when close function gets called. So we do not need to worry about it.
    appendTo.appendChild(container);
    vm = vNode.component!;
  });
}

async function getBpmnUtil() {
  const { bpmn } = await load();
  return bpmn;
}

export function useAsyncLoader() {
  return {
    setAppContext,
    load,
    getBpmnUtil
  };
}
