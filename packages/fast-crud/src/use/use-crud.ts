import defaultCrudOptions from "./default-crud-options";
import _ from "lodash-es";
import { useMerge } from "./use-merge";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import logger from "../utils/util.log";
import { uiContext } from "../ui";
import { useI18n } from "../locale";
import { ComputeContext, CrudBinding, CrudExpose, ScopeContext } from "../d.ts";
import { useCompute } from "./use-compute";
import { useColumns } from "./use-columns";
import { CrudOptions } from "../d.ts/crud";
import { computed, Ref, ref } from "vue";
import { useExpose } from "./use-expose";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { merge, cloneDeep } = useMerge();

export type UseCrudProps = {
  crudOptions: CrudOptions;
  /**
   * 即将废弃，请使用crudExpose
   */
  expose?: CrudExpose;
  crudExpose?: CrudExpose;
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
  resetCrudOptions: (options: CrudOptions) => void;

  /**
   * 追加配置,注意是覆盖crudBinding的结构，而不是crudOptions的结构
   * @param overOptions
   */
  appendBindingOptions: (overBinding: CrudBinding) => void;
};

// 导出useCrud
export function useCrud(ctx: UseCrudProps): UseCrudRet {
  const ui = uiContext.get();
  const { t } = useI18n();
  const options: CrudOptions = ctx.crudOptions;
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
      doAfterChange() {
        return doRefresh();
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
        async doSubmit(context: any) {
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
        async doSubmit(context: any) {
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
            click: async (context: any) => {
              context.row = context[ui.tableColumn.row];
              await expose.doRemove(context);
            }
          },
          edit: {
            click: async (context: any) => {
              context.row = context[ui.tableColumn.row];
              await expose.openEdit({
                row: context.row,
                index: context.index
              });
            }
          },
          view: {
            click: async (context: any) => {
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
          crudBinding.value.sort = isServerSort ? { prop, order, asc } : null;
          expose.doRefresh();
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

  function rebuildCrudBindings(options: CrudOptions) {
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
  function resetCrudOptions(options: CrudOptions) {
    // 设置crudOptions Ref
    crudBinding.value = rebuildCrudBindings(options);
    logger.info("fast-crud inited, crudBinding=", crudBinding.value);
  }

  resetCrudOptions(options);

  /**
   * 追加配置,注意是覆盖crudBinding的结构，而不是crudOptions的结构
   * @param overOptions
   */
  function appendBindingOptions(overOptions: CrudBinding) {
    merge(crudBinding.value, overOptions);
  }

  return {
    resetCrudOptions,
    appendBindingOptions
  };
}

export type UseFsRet = {
  crudRef: Ref;
  crudBinding: Ref<CrudBinding>;
  crudExpose: CrudExpose;
} & UseCrudRet &
  CreateCrudOptionsRet;

export type CreateCrudOptionsProps = {
  crudExpose: CrudExpose;

  expose?: CrudExpose;

  [key: string]: any;
};

export type CreateCrudOptionsRet = {
  crudOptions: CrudOptions;
  /**
   * 其他从createCrudOptions自定义返回的参数
   */
  [key: string]: any;
};
export type UseFsProps = {
  crudRef?: Ref;
  crudBinding?: Ref<CrudBinding>;
  createCrudOptions: CreateCrudOptions | CreateCrudOptionsAsync;

  /**
   * 传给createCrudOptions方法的自定义参数
   */
  [key: string]: any;
};
export type CreateCrudOptions = (props: CreateCrudOptionsProps) => CreateCrudOptionsRet;

export type CreateCrudOptionsAsync = (props: CreateCrudOptionsProps) => Promise<CreateCrudOptionsRet>;
export function useFsReal(props: UseFsProps): UseFsRet | Promise<UseCrudRet> {
  const { createCrudOptions } = props;
  const crudRef = props.crudRef || ref();
  // crud 配置的ref
  const crudBinding: Ref<CrudBinding> = props.crudBinding || ref({});
  // 暴露的方法
  const { crudExpose } = useExpose({ crudRef, crudBinding });
  // 你的crud配置
  const crudOptionsRet = createCrudOptions({
    ...props,
    crudExpose,
    expose: crudExpose
  });

  function initCrud(crudOptionsRet: CreateCrudOptionsRet) {
    const useCrudRet = useCrud({ crudExpose, ...crudOptionsRet });
    return {
      ...crudOptionsRet,
      ...useCrudRet,
      crudRef,
      crudExpose,
      crudBinding
    };
  }

  if (crudOptionsRet instanceof Promise) {
    return crudOptionsRet.then((ret) => {
      return initCrud(ret);
    });
  } else {
    // 初始化crud配置
    return initCrud(crudOptionsRet);
  }
}

export function useFs(props: UseFsProps): UseFsRet {
  return useFsReal(props) as UseFsRet;
}

export function useFsAsync(props: UseFsProps): Promise<UseFsRet> {
  return useFsReal(props) as Promise<UseFsRet>;
}
