import defaultCrudOptions from "./default-crud-options";
import _ from "lodash-es";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ref } from "vue";
import logger from "../utils/util.log";
import typesUtil from "../utils/util.types";
import { uiContext } from "../ui";
import { useI18n } from "../local";
import useExpose from "./use-expose";
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

export default function (ctx) {
  const ui = uiContext.get();
  const { t, tc } = useI18n(); // call `useI18n`, and spread `t` from  `useI18n` returning

  const options: CrudOptions = ctx.options;
  const crudRef = ctx.crudRef;

  const crudOptions = ref();

  const { doValueBuilder, doValueResolve } = useExpose(crudRef);
  async function doRefresh() {
    let page;
    if (crudOptions.value.pagination) {
      page = {
        currentPage: crudOptions.value.pagination.currentPage,
        pageSize: crudOptions.value.pagination.pageSize,
      };
    }
    let searchFormData = {};
    if (crudRef.value) {
      searchFormData = crudRef.value.getSearchFormData();
    }
    let query = { page, form: searchFormData };
    if (crudOptions.value.request.transformQuery) {
      query = crudOptions.value.request.transformQuery(query);
    }

    crudOptions.value.table.loading = true;
    let pageRes;
    try {
      logger.debug("pageRequest", query);
      pageRes = await crudOptions.value.request.pageRequest(query);
    } finally {
      crudOptions.value.table.loading = false;
    }
    if (pageRes == null) {
      logger.warn("pageRequest返回结果不能为空");
      return;
    }
    if (crudOptions.value.request.transformRes) {
      pageRes = crudOptions.value.request.transformRes({ res: pageRes, query });
    }
    const {
      currentPage = page.currentPage,
      pageSize = page.pageSize,
      total,
    } = pageRes;
    const { records } = pageRes;
    if (records == null) {
      logger.warn(
        "pageRequest返回结构不正确，请配置request.transformRes，期望：{currentPage, pageSize, total, records:[]},实际返回：",
        pageRes
      );
      return;
    }

    //valueBuild
    doValueBuilder(records);

    crudOptions.value.data = records;
    if (crudOptions.value.pagination) {
      crudOptions.value.pagination.currentPage = currentPage;
      crudOptions.value.pagination.pageSize = pageSize;
      crudOptions.value.pagination.total = total || records.length;
    }
  }

  function doPageTurn(no: number) {
    crudOptions.value.pagination.currentPage = no;
  }
  /**
   *
   * @param opts = {
   *   form
   *   goFirstPage =true
   *   mergeForm=false
   * }
   */
  async function doSearch(opts) {
    logger.debug("dosearch:", opts);
    opts = _.merge({ goFirstPage: true }, opts);
    if (opts.goFirstPage) {
      doPageTurn(1);
    }
    if (opts.form && crudRef.value) {
      crudRef.value.setSearchFormData(opts);
    }

    await doRefresh();
  }

  function usePagination() {
    return {
      pagination: {
        // element 页码改动回调
        onCurrentChange(event) {
          crudOptions.value.pagination.currentPage = event;
          doRefresh();
        },
        onSizeChange(event) {
          crudOptions.value.pagination.pageSize = event;
          doRefresh();
        },
        // antd 页码改动回调
        onChange(page) {
          crudOptions.value.pagination.currentPage = page;
          crudOptions.value.pagination.current = page;
          doRefresh();
        },
        onShowSizeChange(current, size) {
          crudOptions.value.pagination.pageSize = size;
          doRefresh();
        },
      },
    };
  }

  function useFormSubmit() {
    return {
      editForm: {
        async doSubmit(context) {
          doValueResolve(context);
          await crudOptions.value.request.editRequest(context);
          doRefresh();
        },
      },
      addForm: {
        async doSubmit(context) {
          doValueResolve(context);
          await crudOptions.value.request.addRequest(context);
          doRefresh();
        },
      },
    };
  }

  function useRemove() {
    return {
      rowHandle: {
        remove: {
          click: async function (context) {
            // TODO i18n
            try {
              console.log("ui", ui, context);
              await ui.messageBox.confirm({
                title: t("fs.rowHandle.remove.confirmTitle"), // '提示',
                message: t("fs.rowHandle.remove.confirmMessage"), // '确定要删除此记录吗?',
                type: "warn",
              });
            } catch (e) {
              logger.info("delete canceled", e.message);
              return;
            }
            context.row = context[ui.tableColumn.row];
            await crudOptions.value.request.delRequest(context.row.id);
            ui.notification.success(t("fs.rowHandle.remove.success"));
            await doRefresh();
          },
        },
      },
    };
  }

  function useSearch() {
    return {
      search: {
        doSearch,
      },
    };
  }

  function useEvent() {
    return {
      "onUpdate:search"(value) {
        crudOptions.value.search.show = value;
      },
      "onUpdate:compact"(value) {
        crudOptions.value.toolbar.compact = value;
      },
      "onUpdate:columns"(value) {
        crudOptions.value.table.columns = value;
      },
      onRefresh() {
        doRefresh();
      },
    };
  }

  function initCrudOptions(options) {
    const userOptions = _.merge(
      defaultCrudOptions.defaultOptions({ t, tc }),
      usePagination(),
      useFormSubmit(),
      useRemove(),
      useSearch(),
      useEvent(),
      defaultCrudOptions.commonOptions(ctx),
      options
    );

    // 分散 合并到不同的维度
    const tableColumns: any[] = [];
    const formColumns = {};
    const addFormColumns = {};
    const editFormColumns = {};
    const viewFormColumns = {};
    const searchColumns = {};

    function mergeFromForm(
      targetColumns,
      item,
      key,
      mergeSrc,
      addLabel = false
    ) {
      const formColumn = _.cloneDeep(item[mergeSrc]) || {};
      if (addLabel) {
        if (formColumn.title == null) {
          formColumn.title = item.title;
        }
      }
      formColumn.key = key;
      targetColumns[key] = formColumn;
    }
    function eachColumns(columns, tableParentColumns: any[] = tableColumns) {
      _.forEach(columns, (item, key) => {
        item.key = key;
        // types merge
        if (item.type) {
          const typeOptions = typesUtil.getType(item.type);
          if (typeOptions) {
            item = _.merge({}, typeOptions, item);
          }
        }
        // copy dict
        if (item.dict) {
          if (item.column?.component) {
            item.column.component.dict = _.merge(
              {},
              item.dict,
              item.column.component.dict
            );
          }
          if (item.form?.component) {
            item.form.component.dict = _.merge(
              {},
              item.dict,
              item.form.component.dict
            );
          }
        }

        const tableColumn = item.column || {};
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
    userOptions.form = _.merge(_.cloneDeep(userOptions.form), {
      columns: formColumns,
    });
    userOptions.editForm = _.merge(
      _.cloneDeep(userOptions.form),
      { columns: editFormColumns },
      userOptions.editForm
    );
    userOptions.addForm = _.merge(
      _.cloneDeep(userOptions.form),
      { columns: addFormColumns },
      userOptions.addForm
    );
    userOptions.viewForm = _.merge(
      _.cloneDeep(userOptions.form),
      { columns: viewFormColumns },
      userOptions.viewForm
    );
    userOptions.search = _.merge(
      { columns: userOptions.form.columns },
      { columns: searchColumns },
      userOptions.search
    );
    userOptions.table.columns = tableColumns;

    // 单独处理viewForm的component
    _.forEach(userOptions.viewForm.columns, (value) => {
      if (!value.component) {
        value.component = {};
      }
      value.component.disabled = true;
    });
    // 与默认配置合并
    crudOptions.value = userOptions;
    logger.info("fast-crud inited:", crudOptions.value);
  }

  initCrudOptions(options);

  function onFormValueChange(context) {
    console.log("onFormValueChange", context);
  }
  return {
    doRefresh,
    doPageTurn,
    doSearch,
    onFormValueChange,
    crudOptions,
  };
}
