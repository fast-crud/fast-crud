import { useMerge } from "./use-merge";
import types from "../types";
import { Constants } from "../utils/util.constants";
import defaultCrudOptions from "./default-crud-options";
import _ from "lodash-es";
import { reactive } from "vue";
import { useI18n } from "../locale";
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
  const tableColumns: any = [];
  //合并为tableColumns
  _.forEach(columns, (item) => {
    const column = buildTableColumn(item);
    tableColumns.push(column);
  });
  //排序
  return doArraySort(tableColumns);
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
function buildForm(baseOptions, formType, columnsMap, onComplete?) {
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

function buildFormOptions(crudOptions) {
  const { t } = useI18n();
  const userOptions = merge(
    defaultCrudOptions.defaultOptions({ t }),
    defaultCrudOptions.commonOptions({}),
    crudOptions
  );
  const initedColumns = setupOptionsColumns(cloneDeep(userOptions.columns));
  const columnsMap = buildOptionsColumnsMap({}, initedColumns);
  return buildForm(userOptions, "form", columnsMap);
}

function buildColumns(userOptions) {
  _.forEach(userOptions.columns, (value, key) => {
    value.key = key;
  });
  const columns = setupOptionsColumns(cloneDeep(userOptions.columns));
  userOptions.columns = columns;
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
  return userOptions;
}

export function useColumns() {
  return {
    buildFormOptions,
    buildColumns
  };
}
