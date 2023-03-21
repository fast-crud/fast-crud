import { FormProps, OpenDialogProps } from "../d";
import { ComponentInternalInstance, createVNode, render, VNode } from "vue";
import { FsFormWrapper } from "../components";

export type FormWrapperInstance = {
  id: string;
  vNode: VNode;
  vm: ComponentInternalInstance;
  props: any;
};
let seed = 0;
const FsFormWrapperList: {
  [key: string]: FormWrapperInstance;
} = {};
async function createFormWrapper(opts: FormProps) {
  const id = opts.id || `${seed++}`;

  const container = document.createElement("div");

  return new Promise((resolve, reject) => {
    let instance: FormWrapperInstance = FsFormWrapperList[id];
    if (instance != null) {
      instance.vm.exposed.open(opts);
      resolve(instance);
    }
    const vNode = createVNode(FsFormWrapper, {
      id,
      onClosed() {
        if (!opts.id) {
          delete FsFormWrapperList[id];
        }
      }
    });
    vNode.appContext = FsFormWrapper._context; // || message._context;

    render(vNode, container);
    const appendTo = document.body;
    // instances will remove this item when close function gets called. So we do not need to worry about it.
    appendTo.appendChild(container);

    const vm = vNode.component!;

    instance = {
      id,
      vNode,
      vm,
      props: (vNode.component as any).props
    };
    FsFormWrapperList[id] = instance;
    //打开对话框
    instance.vm.exposed.open(opts);
    //返回ref
    resolve(instance.vm.exposed);
  });
}

export function useFormWrapper() {
  const openDialog = async (opts: OpenDialogProps) => {
    return await createFormWrapper(opts);
  };

  return {
    openDialog
  };
}
