import defaultCrudOptions from "./default-crud-options";
import _ from "lodash-es";
import { useMerge } from "./use-merge";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import logger from "../utils/util.log";
import { uiContext } from "../ui";
import { useI18n } from "../locale";
import { CrudExpose } from "../d.ts";
import { useCompute } from "./use-compute";
import { useColumns } from "./use-columns";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { merge, cloneDeep } = useMerge();
export interface CrudOptions {
  mode?:{
    //模式名称: local,remote
    name:string;
    // 更新时是否merge
    isMergeWhenUpdate:boolean;
    // 添加时是否在列表最后插入
    isAppendWhenAdd:boolean;
  };
  table?: {};
  columns?: {};
  data?: [];
  rowHandle?: {};
  search?: {};
  toolbar?: {};
  actionbar?: {};
  form?: {};
  addForm?: {};
  editForm?: {};
  viewForm?: {};
  pagination?: {};
  request?: {};
}
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

// 导出useCrud
export function useCrud(ctx: UseCrudProps) {
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
      setCurrentPage(current) {
        crudBinding.value.pagination[ui.pagination.currentPage] = current;
      },
      setPageSize(pageSize) {
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
        async doSubmit(context) {
          doValueResolve(context);
          if(options.mode?.name === 'local'){
            expose.updateTableRow(context.index,context.form, options.mode.isMergeWhenUpdate)
          }else{
            await crudBinding.value.request.editRequest(context);
            doRefresh();
          }
        }
      },
      addForm: {
        async doSubmit(context) {
          doValueResolve(context);
          if(options.mode?.name === 'local'){
            const index = options.mode.isAppendWhenAdd ? expose.getTableData().length : 0;
            expose.insertTableRow(index, context.form)
          }else{
            await crudBinding.value.request.addRequest(context);
            doRefresh();
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
            click: async (context) => {
              context.row = context[ui.tableColumn.row];
              await expose.doRemove(context);
            }
          },
          edit: {
            click: async (context) => {
              context.row = context[ui.tableColumn.row];
              await expose.openEdit({
                row: context.row,
                index: context.index
              });
            }
          },
          view: {
            click: async (context) => {
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
        doSearch
      }
    };
  }

  function useEvent() {
    return {
      "onUpdate:search"(value) {
        crudBinding.value.search.show = value;
      },
      "onUpdate:compact"(value) {
        crudBinding.value.toolbar.compact = value;
      },
      "onUpdate:columns"(value) {
        const original = crudBinding.value.table.columns;
        const columns: Array<any> = [];
        _.forEach(value, (item) => {
          for (const column of original) {
            if (column.key === item.key) {
              merge(column, item);
              columns.push(column);
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
        onSortChange({ isServerSort, prop, asc, order }) {
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
              click: ({ index }) => {
                expose.editable.doRemoveRow({ index });
              }
            }
          },
          editRow: {
            edit: {
              text: "编辑",
              loading: compute(({ index }) => {
                const editableRow = expose.editable.getEditableRow(index);
                return !!editableRow?.isLoading;
              }),
              click: ({ index }) => {
                expose.editable.getEditableRow(index)?.active();
              },
              show: compute(({ index }) => {
                return !expose.editable?.getEditableRow(index)?.isEditing;
              })
            },
            save: {
              text: "保存",
              loading: false,
              click: ({ index }) => {
                expose.editable.doSaveRow({ index });
              },
              show: compute(({ index }) => {
                return !!expose.editable?.getEditableRow(index)?.isEditing;
              })
            },
            cancel: {
              text: "取消",
              click: async ({ index }) => {
                await expose.editable?.doCancelRow({ index });
              },
              show: compute(({ index }) => {
                return !!expose.editable?.getEditableRow(index)?.isEditing;
              })
            },
            remove: {
              text: "删除",
              ...ui.button.colors("danger"),
              click: async ({ index }) => {
                expose.editable?.doRemoveRow({ index });
              }
            }
          }
        }
      }
    };
  }

  function resetCrudOptions(options) {
    let userOptions = merge(
      defaultCrudOptions.defaultOptions({ t }),
      usePagination(),
      useFormSubmit(),
      useRowHandle(),
      useSearch(),
      useEvent(),
      useTable(),
      useActionbar(),
      useEditable(),
      defaultCrudOptions.commonOptions(ctx),
      options
    );

    const { buildColumns } = useColumns();
    //初始化columns，将crudOptions.columns里面的配置转化为crudBinding
    const bindOptions = buildColumns(userOptions);
    // 设置crudOptions Ref
    crudBinding.value = bindOptions;
    logger.info("fast-crud inited, crudBinding=", crudBinding.value);
  }

  resetCrudOptions(options);

  /**
   * 追加配置,注意是覆盖crudBinding的结构，而不是crudOptions的结构
   * @param overOptions
   */
  function appendBindingOptions(overOptions) {
    merge(crudBinding.value, overOptions);
  }

  return {
    resetCrudOptions,
    appendBindingOptions
  };
}
