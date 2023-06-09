import defaultCrudOptions from "./default-crud-options";
import _ from "lodash-es";
import { useMerge } from "./use-merge";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import logger from "../utils/util.log";
import { uiContext } from "../ui";
import { useI18n } from "../locale";
import { ComputeContext, CrudBinding, CrudExpose, DynamicallyCrudOptions, DynamicType, ScopeContext } from "../d";
import { useCompute } from "./use-compute";
import { useColumns } from "./use-columns";
import { CrudOptions } from "../d/crud";
import { Ref, ref } from "vue";
import { useExpose } from "./use-expose";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { merge, cloneDeep } = useMerge();

export type UseCrudProps<T = UseFsContext> = {
  crudOptions: DynamicallyCrudOptions;
  /**
   * 即将废弃，请使用crudExpose
   */
  expose?: CrudExpose;
  crudExpose: CrudExpose;

  context: T;
  /**
   * 自定义参数
   * common里面可以使用
   */
  [key: string]: any;
};

export type UseCrudRet = {
  /**
   * 重新设置crudOptions
   * @param overOptions
   */
  resetCrudOptions: (options: DynamicType<CrudOptions>) => void;

  /**
   * 追加配置,注意是覆盖crudBinding的结构，而不是crudOptions的结构
   * @param overBinding
   */
  appendCrudBinding: (overBinding: CrudBinding) => void;
};

// 导出useCrud
export function useCrud(ctx: UseCrudProps): UseCrudRet {
  const ui = uiContext.get();
  const { t } = useI18n();
  const options: CrudOptions = ctx.crudOptions as CrudOptions;
  const crudExpose = ctx.expose || ctx.crudExpose;
  if (!crudExpose) {
    throw new Error("crudExpose不能为空，请给useCrud传入{crudExpose}参数");
  }
  const expose: CrudExpose = crudExpose;

  const { crudBinding } = expose;

  const { doRefresh, doValueResolve, doSearch } = expose;

  function usePagination() {
    const events = ui.pagination.onChange({
      setCurrentPage(current: number) {
        crudBinding.value.pagination[ui.pagination.currentPage] = current;
      },
      setPageSize(pageSize: number) {
        crudBinding.value.pagination.pageSize = pageSize;
        crudBinding.value.pagination[ui.pagination.currentPage] = 1; //重置页码到1
      },
      async doAfterChange() {
        return await doRefresh();
      }
    });
    return {
      pagination: {
        ...events
      }
    };
  }

  function useFormSubmit() {
    return {
      editForm: {
        async doSubmit(context: ScopeContext) {
          doValueResolve(context);
          if (options.mode?.name === "local") {
            expose.updateTableRow(context.index, context.form, options.mode.isMergeWhenUpdate);
          } else {
            const res = await crudBinding.value.request.editRequest(context);
            doRefresh();
            return res;
          }
        }
      },
      addForm: {
        async doSubmit(context: ScopeContext) {
          doValueResolve(context);
          if (options.mode?.name === "local") {
            const index = options.mode.isAppendWhenAdd ? expose.getTableData().length : 0;
            expose.insertTableRow(index, context.form);
          } else {
            const res = await crudBinding.value.request.addRequest(context);
            doRefresh();
            return res;
          }
        }
      }
    };
  }

  function useRowHandle() {
    return {
      rowHandle: {
        buttons: {
          remove: {
            click: async (context: ScopeContext) => {
              // @ts-ignore
              context.row = context[ui.tableColumn.row];
              await expose.doRemove(context);
            }
          },
          edit: {
            click: async (context: ScopeContext) => {
              // @ts-ignore
              context.row = context[ui.tableColumn.row];
              await expose.openEdit({
                row: context.row,
                index: context.index
              });
            }
          },
          view: {
            click: async (context: ScopeContext) => {
              // @ts-ignore
              context.row = context[ui.tableColumn.row];
              await expose.openView({
                row: context.row,
                index: context.index
              });
            }
          }
        }
      }
    };
  }

  function useSearch() {
    return {
      search: {
        doSearch,
        ["onUpdate:collapse"]: (value: any) => {
          crudBinding.value.search.collapse = value;
        },
        container: {
          collapse: true,
          ["onUpdate:collapse"]: (value: any) => {
            crudBinding.value.search.container.collapse = value;
          }
        }
      }
    };
  }

  function useTabs() {
    return {
      tabs: {
        onChange: () => {
          doRefresh();
        }
      }
    };
  }

  function useEvent() {
    return {
      "onUpdate:search"(value: any) {
        crudBinding.value.search.show = value;
      },
      "onUpdate:compact"(value: any) {
        crudBinding.value.toolbar.compact = value;
      },
      "onUpdate:columns"(value: any) {
        const original = crudBinding.value.table.columns;
        const columns: Array<any> = [];
        _.forEach(value, (item) => {
          for (const column of original) {
            if (column.key === item.key) {
              merge(column, item);
              columns.push(column);
              return;
            }
          }
        });

        crudBinding.value.table.columns = columns;
      },
      onRefresh() {
        doRefresh();
      }
    };
  }

  function useTable() {
    return {
      table: {
        onSortChange(sortChange: { isServerSort: boolean; prop: any; asc: any; order: any }) {
          const { isServerSort, prop, asc, order } = sortChange;
          const oldSort = crudBinding.value.table.sort;
          crudBinding.value.table.sort = isServerSort ? { prop, order, asc } : null;
          if (isServerSort || oldSort != null) {
            expose.doRefresh();
          }
        }
      }
    };
  }

  function useActionbar() {
    return {
      actionbar: {
        buttons: {
          add: {
            click() {
              expose.openAdd({});
            }
          }
        }
      }
    };
  }

  function useEditable() {
    const { compute } = useCompute();

    return {
      actionbar: {
        buttons: {
          addRow: {
            show: false, //默认不启用
            text: t("fs.actionbar.add"),
            type: "primary",
            click: () => {
              expose.editable.addRow();
            }
          }
        }
      },
      rowHandle: {
        group: {
          editable: {
            remove: {
              text: "删除",
              ...ui.button.colors("danger"),
              click: (context: ScopeContext) => {
                const { index } = context;
                expose.editable.doRemoveRow({ index });
              }
            }
          },
          editRow: {
            edit: {
              text: "编辑",
              loading: compute((context: ComputeContext) => {
                const { index } = context;
                const editableRow = expose.editable.getEditableRow(index);
                return !!editableRow?.isLoading;
              }),
              click: (context: ScopeContext) => {
                const { index } = context;
                expose.editable.getEditableRow(index)?.active();
              },
              show: compute((context: ComputeContext) => {
                const { index } = context;
                return !expose.editable?.getEditableRow(index)?.isEditing;
              })
            },
            save: {
              text: "保存",
              loading: false,
              click: (context: ScopeContext) => {
                const { index } = context;
                expose.editable.doSaveRow({ index });
              },
              show: compute((context: ComputeContext) => {
                const { index } = context;
                return !!expose.editable?.getEditableRow(index)?.isEditing;
              })
            },
            cancel: {
              text: "取消",
              click: async (context: ScopeContext) => {
                const { index } = context;
                await expose.editable?.doCancelRow({ index });
              },
              show: compute((context: ComputeContext) => {
                const { index } = context;
                return !!expose.editable?.getEditableRow(index)?.isEditing;
              })
            },
            remove: {
              text: "删除",
              ...ui.button.colors("danger"),
              click: async (context: ScopeContext) => {
                const { index } = context;
                expose.editable?.doRemoveRow({ index });
              }
            }
          }
        }
      }
    };
  }

  function rebuildCrudBindings(options: DynamicallyCrudOptions) {
    const userOptions = merge(
      defaultCrudOptions.defaultOptions({ t }),
      usePagination(),
      useFormSubmit(),
      useRowHandle(),
      useSearch(),
      useTabs(),
      useEvent(),
      useTable(),
      useActionbar(),
      useEditable(),
      defaultCrudOptions.commonOptions(ctx),
      options
    );

    const { buildColumns } = useColumns();
    //初始化columns，将crudOptions.columns里面的配置转化为crudBinding
    return buildColumns(userOptions);
  }

  function resetCrudOptions(options: DynamicallyCrudOptions) {
    // 设置crudOptions Ref
    crudBinding.value = rebuildCrudBindings(options);
    logger.info("fast-crud inited, crudBinding=", crudBinding.value);
  }

  resetCrudOptions(options);

  /**
   * 追加配置,注意是覆盖crudBinding的结构，而不是crudOptions的结构
   * @param overOptions
   */
  function appendCrudBinding(overOptions: CrudBinding) {
    merge(crudBinding.value, overOptions);
  }

  return {
    resetCrudOptions,
    appendCrudBinding
  };
}

export type UseFsRet = {
  crudRef: Ref;
  crudBinding: Ref<CrudBinding>;
  crudExpose: CrudExpose;
} & UseCrudRet &
  CreateCrudOptionsRet;

export type UseFsContext = {
  [key: string]: any;
};

export type CreateCrudOptionsProps<T = UseFsContext> = {
  crudExpose?: CrudExpose;

  expose?: CrudExpose;

  context?: T;
};

export type CreateCrudOptionsRet = {
  /**
   * crudOptions
   */
  crudOptions: DynamicallyCrudOptions;

  /**
   * 自定义返回变量
   */
  [key: string]: any;
};
export type UseFsProps<T = UseFsContext> = {
  crudRef?: Ref;
  crudBinding?: Ref<CrudBinding>;

  crudExposeRef?: Ref<CrudExpose>;
  createCrudOptions: CreateCrudOptions | CreateCrudOptionsAsync;

  onExpose?: (context: OnExposeContext<T>) => any;

  context?: T;
};
export type CreateCrudOptions = (props: CreateCrudOptionsProps) => CreateCrudOptionsRet;
export type OnExposeContext<T = UseFsContext> = {
  crudRef: Ref;
  crudBinding: Ref<CrudBinding>;
  crudExpose: CrudExpose;
  context: T;
};

export type CreateCrudOptionsAsync = (props: CreateCrudOptionsProps) => Promise<CreateCrudOptionsRet>;

function useFsImpl(props: UseFsProps): UseFsRet | Promise<UseCrudRet> {
  const { createCrudOptions, crudExposeRef } = props;
  const crudRef = props.crudRef || ref();
  // crud 配置的ref
  const crudBinding: Ref<CrudBinding> = props.crudBinding || ref({});
  // 暴露的方法
  const { crudExpose } = useExpose({ crudRef, crudBinding });

  if (crudExposeRef && !crudExposeRef.value) {
    crudExposeRef.value = crudExpose;
  }

  if (props.context == null) {
    props.context = {};
  }
  const context = props.context;
  if (props.onExpose) {
    props.onExpose({ crudRef, crudBinding, crudExpose, context });
  }
  // 你的crud配置
  const createCrudOptionsRet = createCrudOptions({
    ...props,
    crudExpose,
    expose: crudExpose,
    context
  });

  function initCrud(createCrudOptionsRet: CreateCrudOptionsRet) {
    const useCrudRet = useCrud({ crudExpose, ...createCrudOptionsRet, context });
    return {
      ...createCrudOptionsRet,
      ...useCrudRet,
      crudRef,
      crudExpose,
      crudBinding
    };
  }

  if (createCrudOptionsRet instanceof Promise) {
    return createCrudOptionsRet.then((ret) => {
      return initCrud(ret);
    });
  } else {
    // 初始化crud配置
    return initCrud(createCrudOptionsRet);
  }
}

export function useFs(props: UseFsProps): UseFsRet {
  return useFsImpl(props) as UseFsRet;
}

export function useFsAsync(props: UseFsProps): Promise<UseFsRet> {
  return useFsImpl(props) as Promise<UseFsRet>;
}
