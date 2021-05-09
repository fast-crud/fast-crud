import defaultCrudOptions from "./default-crud-options";
import _ from "lodash-es";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ref, reactive } from "vue";
import logger from "../utils/util.log";
import types from "../types";
import { uiContext } from "../ui";
import { useI18n } from "../local";
import { useMerge } from "../use/use-merge";
import { CrudExpose } from "../use/use-expose";
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
  const { t, tc } = useI18n(); // call `useI18n`, and spread `t` from  `useI18n` returning

  const options: CrudOptions = ctx.crudOptions;
  const expose = ctx.expose;
  const { crudBinding } = expose;

  const { doRefresh, doValueResolve, doSearch } = expose;

  function usePagination() {
    return {
      pagination: {
        // element 页码改动回调
        onCurrentChange(event) {
          crudBinding.value.pagination.currentPage = event;
          doRefresh();
        },
        onSizeChange(event) {
          crudBinding.value.pagination.pageSize = event;
          doRefresh();
        },
        // antd 页码改动回调
        onChange(page) {
          crudBinding.value.pagination.currentPage = page;
          crudBinding.value.pagination.current = page;
          doRefresh();
        },
        onShowSizeChange(current, size) {
          crudBinding.value.pagination.pageSize = size;
          doRefresh();
        }
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

  function useRemove() {
    const doRemove = async function (context) {
      // TODO i18n
      try {
        await ui.messageBox.confirm({
          title: t("fs.rowHandle.remove.confirmTitle"), // '提示',
          message: t("fs.rowHandle.remove.confirmMessage"), // '确定要删除此记录吗?',
          type: "warn"
        });
      } catch (e) {
        logger.info("delete canceled", e.message);
        return;
      }
      context.row = context[ui.tableColumn.row];
      await crudBinding.value.request.delRequest(context);
      ui.notification.success(t("fs.rowHandle.remove.success"));
      await doRefresh();
    };
    return {
      rowHandle: {
        buttons: {
          remove: {
            click: doRemove
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
        //监听el-table的服务端排序
        onSortChange({ column, prop, order }) {
          console.log("sort change", column, prop, order);
          crudBinding.value.sort =
            prop && column.sortable === "custom" ? { prop, order, asc: order === "ascending" } : null;
          expose.doRefresh();
        },
        // 监听a-table的服务端排序
        onChange(pagination, filters, sorter) {
          console.log("table change", sorter);
          const { column, field, order } = sorter;
          crudBinding.value.sort =
            order && column.sorter === true ? { prop: field, order, asc: order === "ascend" } : null;
          expose.doRefresh();
        }
      }
    };
  }

  function resetCrudOptions(options) {
    const userOptions = merge(
      defaultCrudOptions.defaultOptions({ t, tc, expose }),
      usePagination(),
      useFormSubmit(),
      useRemove(),
      useSearch(),
      useEvent(),
      useTable(),
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

    function mergeFromForm(targetColumns, item, key, mergeSrc, addLabel = false) {
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

        mergeFromForm(formColumns, item, key, "form", true);
        mergeFromForm(addFormColumns, item, key, "addForm");
        mergeFromForm(editFormColumns, item, key, "editForm");
        mergeFromForm(viewFormColumns, item, key, "viewForm");
        mergeFromForm(searchColumns, item, key, "search");
      });
    }

    eachColumns(userOptions.columns);

    // 分置合并
    userOptions.form = merge(cloneDeep(userOptions.form), {
      columns: formColumns
    });
    userOptions.editForm = merge(cloneDeep(userOptions.form), { columns: editFormColumns }, userOptions.editForm);
    userOptions.addForm = merge(cloneDeep(userOptions.form), { columns: addFormColumns }, userOptions.addForm);
    userOptions.viewForm = merge(cloneDeep(userOptions.form), { columns: viewFormColumns }, userOptions.viewForm);
    userOptions.search = merge({ columns: userOptions.form.columns }, { columns: searchColumns }, userOptions.search);
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
    // 设置crudOptions Ref
    crudBinding.value = userOptions;
    logger.info("fast-crud inited:", crudBinding.value);
  }

  resetCrudOptions(options);

  return {
    resetCrudOptions
  };
}
