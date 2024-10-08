import { DynamicallyCrudOptions, FormProps, OpenDialogProps } from "../d";
import { ComponentInternalInstance, createVNode, inject, render, VNode } from "vue";
import { FsFormWrapper } from "../components";
import logger from "../utils/util.log";
import { useColumns } from "./use-columns";

export type FormWrapperInstance = {
  id: string;
  vNode: VNode;
  vm: ComponentInternalInstance;
  props: any;
};

export type OpenFormDialogProps<R = any> = {
  crudOptions: DynamicallyCrudOptions<R>;
  context?: any;
};

let seed = 0;
const FsFormWrapperList: {
  [key: string]: FormWrapperInstance;
} = {};

// 不建议使用，不含上下文，会丢失主题
async function createFormWrapper<R = any>(opts: FormProps<R>) {
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
  let pd: any = null;
  try {
    const wrapperProvider: Function = inject("use:form:wrapper", () => {});
    pd = wrapperProvider();
  } catch (e) {
    logger.warn("cant inject use:form:wrapper，建议在App.vue中使用<fs-form-provider>组件包裹<router-view/>", e);
  }

  let openDialog: (opts: OpenDialogProps) => Promise<any> = null;
  if (pd == null) {
    //通过在body里面插入组件，无上下文，会丢失主题，不建议使用
    // logger.warn("当前无法通过useFormWrapper打开对话框，请先使用fs-form-provider包裹上层组件");
    openDialog = async (opts: OpenDialogProps) => {
      return await createFormWrapper(opts);
    };
  } else {
    //通过provider插入组件，具备上下文，可以切换主题等，具有provider
    openDialog = async (opts: OpenDialogProps) => {
      return await pd.open(opts);
    };
  }

  async function openCrudFormDialog<R = any>(opts: OpenFormDialogProps<R>) {
    const { buildFormOptions } = useColumns();
    const formOptions = buildFormOptions(opts.crudOptions, opts.context);
    return await openDialog(formOptions);
  }

  return {
    openDialog,
    openCrudFormDialog
  };
}
