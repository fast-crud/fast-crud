import defaultCrudOptions from "./default-crud-options";
import _ from "lodash-es";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ref, reactive } from "vue";
import logger from "../utils/util.log";
import types from "../types";
import { uiContext } from "../ui";
import { useI18n } from "../locale";
import { useMerge } from "./use-merge";
import { CrudExpose } from "../d.ts";
import { useCompute } from "./use-compute";
import { Constants } from "../utils/util.constants";
export interface CrudOptions {
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
  const { t } = useI18n();
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
        crudBinding.value.pagination.currentPage = 1; //重置页码到1
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

  /**
   * 排序
   * @param arr
   */
  function doArraySort(arr) {
    return _.sortBy(arr, (item) => {
      return item.order ?? Constants.orderDefault;
    });
  }

  /**
   * 初始化用户配置的列
   * 将dict和fieldType合并
   * @param columns
   */
  function setupOptionsColumns(columns) {
    const initedColumns = {};
    _.forEach(columns, (item, key) => {
      item.key = key;
      if (item.children) {
        item.children = setupOptionsColumns(item.children);
      } else {
        //执行mergePlugin，复制type，复制dict
        for (const plugin of mergeColumnPlugins) {
          item = plugin(item);
        }
      }
      initedColumns[key] = item;
    });
    return initedColumns;
  }

  /**
   * 构建用户配置的列的map
   * 从多级表头里面将列配置拍平
   * @param map
   * @param columns
   */
  function buildOptionsColumnsMap(map = {}, columns) {
    _.forEach(columns, (item, key) => {
      if (item.children) {
        buildOptionsColumnsMap(map, item.children);
      } else {
        map[key] = item;
      }
    });
    return map;
  }

  /**
   * 构建table单个列
   * @param colTemplate
   */
  function buildTableColumn(colTemplate) {
    const item = colTemplate;
    const tableColumn = item.column || {};
    if (tableColumn.title == null) {
      tableColumn.title = item.title;
    }
    tableColumn.key = item.key;
    if (item.children) {
      tableColumn.children = buildTableColumns(item.children);
    }
    return reactive(tableColumn);
  }

  /**
   * 构建列表表头配置
   * @param columns
   */
  function buildTableColumns(columns) {
    const tableColumns = [];
    //合并为tableColumns
    _.forEach(columns, (item) => {
      const column = buildTableColumn(item);
      tableColumns.push(column);
    });

    //排序
    doArraySort(tableColumns);

    return tableColumns;
  }

  /**
   * 将列表表头拍平
   * @param map
   * @param columns
   */
  function buildTableColumnsMap(map = {}, columns) {
    _.forEach(columns, (item) => {
      map[item.key] = item;
      if (item.children && item.children.length > 0) {
        buildTableColumnsMap(map, item.children);
      }
    });
    return map;
  }

  /**
   * 构建公共表单列配置
   * @param columns
   * @param formType
   */
  function buildFormColumns(columns, formType) {
    // 合并form
    const formColumns = {};
    _.forEach(columns, (item) => {
      const formColumn = cloneDeep(item[formType]) || {};
      if (formType === "form" && formColumn.title == null) {
        formColumn.title = item.title;
      }
      formColumn.key = item.key;
      formColumns[item.key] = formColumn;
    });
    return formColumns;
  }

  /**
   * 构建表单配置
   * @param baseOptions
   * @param formType 可选[form/addForm/editForm/viewForm]
   * @param columnsMap
   * @param onComplete
   */
  function buildForm(baseOptions, formType, columnsMap, onComplete) {
    debugger;
    const formColumns = buildFormColumns(columnsMap, formType);
    const form = merge(cloneDeep(baseOptions.form), baseOptions[formType], { columns: formColumns });
    if (onComplete) {
      onComplete(form);
    }
    return form;
  }

  /**
   * 构建查询表单配置，仅复制有限的配置
   * @param baseOptions
   * @param formType
   * @param columnsMap
   */
  function buildSearchForm(baseOptions, formType = "search", columnsMap) {
    const searchColumns = buildFormColumns(columnsMap, formType);
    const formColumnsForSearch = {};
    _.forEach(cloneDeep(baseOptions.form.columns), (item, key) => {
      formColumnsForSearch[key] = _.pick(item, ["component", "valueChange", "title", "key", "label"]);
    });

    return merge({ columns: formColumnsForSearch }, { columns: searchColumns }, baseOptions.search);
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

    const columns = setupOptionsColumns(cloneDeep(userOptions.columns));
    const columnsMap = buildOptionsColumnsMap({}, columns);

    userOptions.table.columns = buildTableColumns(cloneDeep(columns));
    userOptions.table.columnsMap = buildTableColumnsMap({}, userOptions.table.columns);
    userOptions.form = buildForm(userOptions, "form", columnsMap);
    userOptions.addForm = buildForm(userOptions, "addForm", columnsMap);
    userOptions.editForm = buildForm(userOptions, "editForm", columnsMap);
    userOptions.viewForm = buildForm(userOptions, "viewForm", columnsMap, (form) => {
      // 单独处理viewForm的component
      _.forEach(form.columns, (value) => {
        if (!value.component) {
          value.component = {};
        }
        value.component.disabled = true;
      });
    });
    //处理searchColumns， 只从form里面复制component和valueChange
    userOptions.search = buildSearchForm(userOptions, "search", columnsMap);

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
