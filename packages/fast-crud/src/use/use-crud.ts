import defaultCrudOptions from "./default-crud-options";
import _ from "lodash-es";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ref, reactive } from "vue";
import logger from "../utils/util.log";
import types from "../types";
import { uiContext } from "../ui";
import { useI18n } from "../locale";
import { useMerge } from "./use-merge";
import { CrudExpose } from "./use-expose";
import { useCompute } from "./use-compute";
export interface CrudOptions {
  table?: {};
  columns?: [];
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
  expose: CrudExpose;
  /**
   * 自定义参数
   * common里面可以使用
   */
  extra?: any;
  [key: string]: any;
};
const { merge, cloneDeep } = useMerge();
// mergeColumnPlugin 注册
const mergeColumnPlugins: Array<Function> = [];
export function registerMergeColumnPlugin(mergeFn) {
  mergeColumnPlugins.push(mergeFn);
}
function mergeColumnDict(item) {
  // copy dict
  if (item.dict) {
    if (item.column?.component) {
      const dict = cloneDeep(item.dict);
      item.column.component.dict = merge(dict, item.column.component.dict);
    }
    if (item.form?.component) {
      const dict = cloneDeep(item.dict);
      item.form.component.dict = merge(dict, item.form.component.dict);
    }
  }
  return item;
}
function mergeColumnType(item) {
  if (!item.type) {
    return item;
  }
  let typeChain: any = [];
  if (typeof item.type === "string") {
    typeChain = [item.type];
  } else if (item.type instanceof Array) {
    typeChain = item.type;
  }
  const base = {};
  for (const type of typeChain) {
    const typeOptions = types.getType(type);
    if (typeOptions) {
      merge(base, typeOptions);
    }
  }
  item = merge(base, item);
  return item;
}
registerMergeColumnPlugin(mergeColumnType);
registerMergeColumnPlugin(mergeColumnDict);

// 导出useCrud
export function useCrud(ctx: UseCrudProps) {
  const ui = uiContext.get();
  const { t } = useI18n(); // call `useI18n`, and spread `t` from  `useI18n` returning
  const options: CrudOptions = ctx.crudOptions;
  const expose = ctx.expose;
  const { crudBinding } = expose;

  const { doRefresh, doValueResolve, doSearch } = expose;

  function usePagination() {
    const events = ui.pagination.onChange({
      setCurrentPage(current) {
        crudBinding.value.pagination[ui.pagination.currentPage] = current;
        crudBinding.value.pagination.currentPage = current;
      },
      setPageSize(pageSize) {
        crudBinding.value.pagination.pageSize = pageSize;
      },
      doAfterChange() {
        doRefresh();
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
          await crudBinding.value.request.editRequest(context);
          doRefresh();
        }
      },
      addForm: {
        async doSubmit(context) {
          doValueResolve(context);
          await crudBinding.value.request.addRequest(context);
          doRefresh();
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
    const events = ui.table.onSortChange({
      emit({ isServerSort, prop, asc, order }) {
        crudBinding.value.sort = isServerSort ? { prop, order, asc } : null;
        expose.doRefresh();
      }
    });
    return {
      table: {
        ...events
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
    const userOptions = merge(
      defaultCrudOptions.defaultOptions({ t, expose }),
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
    // 分散 合并到不同的维度
    const tableColumns: Array<any> = [];
    const formColumns = {};
    const addFormColumns = {};
    const editFormColumns = {};
    const viewFormColumns = {};
    const searchColumns = {};

    function cloneFromColumns(targetColumns, item, key, mergeSrc, addLabel = false) {
      const formColumn = cloneDeep(item[mergeSrc]) || {};
      if (addLabel) {
        if (formColumn.title == null) {
          formColumn.title = item.title;
        }
      }
      formColumn.key = key;
      targetColumns[key] = formColumn;
    }
    function eachColumns(columns, tableParentColumns: Array<any> = tableColumns) {
      _.forEach(columns, (item, key) => {
        item.key = key;
        //执行mergePlugin，复制type，复制dict
        for (const plugin of mergeColumnPlugins) {
          item = plugin(item);
        }

        const tableColumn = reactive(item.column || {});
        if (tableColumn.title == null) {
          tableColumn.title = item.title;
        }
        tableColumn.key = key;
        tableParentColumns.push(tableColumn);
        if (item.children) {
          eachColumns(item.children, (tableColumn.children = []));
          return;
        }

        cloneFromColumns(formColumns, item, key, "form", true);
        cloneFromColumns(addFormColumns, item, key, "addForm");
        cloneFromColumns(editFormColumns, item, key, "editForm");
        cloneFromColumns(viewFormColumns, item, key, "viewForm");
        cloneFromColumns(searchColumns, item, key, "search");
      });
    }

    //将columns里面的配置分别放clone到对应的form里面
    eachColumns(userOptions.columns);

    // 分置合并
    userOptions.form = merge(cloneDeep(userOptions.form), {
      columns: formColumns
    });
    userOptions.editForm = merge(cloneDeep(userOptions.form), { columns: editFormColumns }, userOptions.editForm);
    userOptions.addForm = merge(cloneDeep(userOptions.form), { columns: addFormColumns }, userOptions.addForm);
    userOptions.viewForm = merge(cloneDeep(userOptions.form), { columns: viewFormColumns }, userOptions.viewForm);

    //处理searchColumns， 只从form里面复制component和valueChange
    const copyColumnsForSearch = cloneDeep(userOptions.form.columns);
    const baseColumnsForSearch = {};
    _.forEach(copyColumnsForSearch, (item, key) => {
      baseColumnsForSearch[key] = _.pick(item, ["component", "valueChange", "title", "key", "label"]);
    });
    userOptions.search = merge({ columns: baseColumnsForSearch }, { columns: searchColumns }, userOptions.search);

    // tableColumns
    userOptions.table.columns = tableColumns;
    const tableColumnsMap = {};
    _.forEach(tableColumns, (item) => {
      tableColumnsMap[item.key] = item;
    });
    userOptions.table.columnsMap = tableColumnsMap;
    // 单独处理viewForm的component
    _.forEach(userOptions.viewForm.columns, (value) => {
      if (!value.component) {
        value.component = {};
      }
      value.component.disabled = true;
    });

    //处理editable form
    if (userOptions.table.editable) {
      userOptions.table.editable.addForm = merge(userOptions.addForm.columns, userOptions.table.editable.addForm);
      userOptions.table.editable.editForm = merge(userOptions.editForm.columns, userOptions.table.editable.editForm);
    }
    // 设置crudOptions Ref
    crudBinding.value = userOptions;
    logger.info("fast-crud inited:", crudBinding.value);
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
