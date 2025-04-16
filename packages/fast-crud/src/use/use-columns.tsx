import { useMerge } from "./use-merge";
import types from "../types";
import defaultCrudOptions from "./default-crud-options";
import { forEach, sortBy, size, pick, remove, includes } from "lodash-es";
import { isRef, reactive, shallowRef } from "vue";
import { useI18n } from "../locale";
import logger from "../utils/util.log";
import {
  ColumnCompositionProps,
  ColumnProps,
  CompositionColumns,
  CrudOptions,
  DynamicallyCrudOptions,
  FormItemProps,
  FormProps,
  ScopeContext,
  TableColumnsProps,
  UseFsContext
} from "../d";
import { Constants } from "../utils/util.constants";

const { merge, cloneDeep } = useMerge();
// mergeColumnPlugin 注册

export type MergeColumnPlugin = {
  name: string;
  handle: (columnProps: any, crudOptions: any) => {};
  order: number;
};

const mergeColumnPlugins: MergeColumnPlugin[] = [];

export function registerMergeColumnPlugin(plugin: MergeColumnPlugin) {
  remove(mergeColumnPlugins, (item: any) => {
    return item.name === plugin.name;
  });
  mergeColumnPlugins.push(plugin);
  mergeColumnPlugins.sort((a, b) => {
    return a.order - b.order;
  });
  logger.debug("mergeColumnPlugin register success: current:", plugin, "registered:", mergeColumnPlugins);
}

function mergeColumnDict(item: ColumnCompositionProps) {
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

function mergeColumnType(item: ColumnCompositionProps) {
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

const mergeColumnPlugin = { name: "type", handle: mergeColumnType, order: -2 };
const dictPlugin = { name: "dict", handle: mergeColumnDict, order: -1 };

const viewFormUseCellComponentPlugin = {
  name: "viewFormUseCellComponent",
  order: 10,
  handle: (columnProps: ColumnCompositionProps = {}, crudOptions: CrudOptions = {}) => {
    if (!crudOptions.settings?.viewFormUseCellComponent) {
      return columnProps;
    }
    // 让viewForm的组件使用cell组件
    const columnComponent = columnProps.column?.component || {};
    const viewFormColumn: FormItemProps = {
      component: columnComponent
    };
    if (columnProps.type === "text" || (columnProps.type instanceof Array && columnProps.type.includes("text"))) {
      viewFormColumn.render = (context: ScopeContext) => {
        const { value } = context;
        return <span>{value}</span>;
      };
    }
    merge(columnProps, { viewForm: viewFormColumn });
    return columnProps;
  }
};

registerMergeColumnPlugin(mergeColumnPlugin);
registerMergeColumnPlugin(dictPlugin);
registerMergeColumnPlugin(viewFormUseCellComponentPlugin);

/**
 * 初始化用户配置的列
 * 将dict和fieldType合并
 * @param columns
 * @param userOptions
 */
function setupOptionsColumns(columns: { [key: string]: ColumnCompositionProps }, userOptions: CrudOptions) {
  const initedColumns: any = {};
  forEach(columns, (item: any, key: any) => {
    item.key = key;
    if (item.children) {
      item.children = setupOptionsColumns(item.children, userOptions);
    } else {
      //执行mergePlugin，复制type，复制dict
      for (const plugin of mergeColumnPlugins) {
        item = plugin.handle(item, userOptions);
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
function buildOptionsColumnsFlatMap(map: CompositionColumns = {}, columns: CompositionColumns) {
  forEach(columns, (item: any, key: any) => {
    if (item.children) {
      buildOptionsColumnsFlatMap(map, item.children);
    } else {
      map[key] = item;
    }
  });
  return map;
}

export function buildTableColumnsFlatMap(map: TableColumnsProps = {}, columns: TableColumnsProps) {
  forEach(columns, (item: any, key: any) => {
    if (item.children) {
      buildTableColumnsFlatMap(map, item.children);
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
function buildTableColumn(colTemplate: any) {
  const item = colTemplate;
  const tableColumn = item.column || {};
  if (tableColumn.title == null) {
    tableColumn.title = item.title;
  }
  tableColumn.key = item.key;
  if (item.children) {
    tableColumn.children = buildTableColumns(item.children);
  }
  wrapperCustomComponent(tableColumn);
  return reactive(tableColumn);
}

function wrapperCustomComponent(column: any) {
  if (!column) {
    return;
  }
  if (column.component?.name && typeof column.component.name !== "string") {
    //自定义组件;
    if (!isRef(column.component.name)) {
      column.component.name = shallowRef(column.component.name);
    }
  }
}
/**
 * 构建列表表头配置
 * @param columns
 */
function buildTableColumns(columns: CompositionColumns): TableColumnsProps {
  let tableColumns: TableColumnsProps = {};
  //合并为tableColumns
  forEach(columns, (item: any, key: any) => {
    tableColumns[key] = buildTableColumn(item);
  });
  //排序
  tableColumns = doColumnsSort(tableColumns);
  return tableColumns;
}

function doArraySort(arr: any) {
  return sortBy(arr, (item: any) => {
    return item.order ?? Constants.orderDefault;
  });
}

function doColumnsSort(columns: TableColumnsProps): TableColumnsProps {
  const list: ColumnProps[] = [];
  for (const key in columns) {
    const item = columns[key];
    item.key = key;
    if (item.children && size(item.children) > 0) {
      item.children = doColumnsSort(item.children);
    }
    list.push(item);
  }
  const columnsArr: ColumnProps[] = doArraySort(list);
  const columnsMap: TableColumnsProps = {};
  for (const item of columnsArr) {
    columnsMap[item.key] = item;
  }
  return columnsMap;
}

/**
 * 构建公共表单列配置
 * @param columnsFlatMap
 * @param formType
 */
function buildFormColumns(columnsFlatMap: CompositionColumns, formType: string) {
  // 合并form
  const formColumns: any = {};
  forEach(columnsFlatMap, (item: any) => {
    const formColumn = cloneDeep(item[formType]) || {};
    if (formType === "form" && formColumn.title == null) {
      formColumn.title = item.title;
    }
    formColumn.key = item.key;
    formColumns[item.key] = formColumn;

    wrapperCustomComponent(formColumn);
  });
  return formColumns;
}

/**
 * 构建表单配置
 * @param baseOptions
 * @param formType 可选[form/addForm/editForm/viewForm]
 * @param columnsFlatMap
 * @param onComplete
 */
function buildForm(
  baseOptions: CrudOptions,
  formType: string,
  columnsFlatMap: CompositionColumns,
  onComplete?: (form: any) => void
) {
  const formColumns = buildFormColumns(columnsFlatMap, formType);
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
function buildSearchForm(baseOptions: CrudOptions, formType = "search", columnsMap: CompositionColumns) {
  const searchColumns = buildFormColumns(columnsMap, formType);
  const formColumnsForSearch: any = {};
  const copyProps = baseOptions.settings?.searchCopyFormProps ?? [
    "component",
    "valueChange",
    "title",
    "key",
    "label",
    "render"
  ];

  function copyFromCompositionColumn(target: any, key: string, field: string) {
    const needCopy = includes(copyProps, field);
    if (needCopy && baseOptions.columns[key]) {
      const common = baseOptions.columns[key][field];
      if (common) {
        target[field] = common;
      }
    }
  }

  forEach(cloneDeep(baseOptions.form.columns), (item: any, key: any) => {
    const def = {};
    copyFromCompositionColumn(def, key, "valueResolve");
    copyFromCompositionColumn(def, key, "valueBuilder");
    formColumnsForSearch[key] = merge(def, pick(item, copyProps));
  });
  return merge({ columns: formColumnsForSearch }, { columns: searchColumns }, baseOptions.search);
}

function buildFormOptions(
  crudOptions: DynamicallyCrudOptions,
  context?: UseFsContext,
  mode: string = "form"
): FormProps {
  const { t } = useI18n();
  const { merge } = useMerge();
  context = context || {};
  const userOptions = merge(
    defaultCrudOptions.defaultOptions({ t }),
    defaultCrudOptions.commonOptions({ crudOptions, context, crudExpose: null }),
    crudOptions
  );
  const initedColumns = setupOptionsColumns(cloneDeep(userOptions.columns), userOptions);
  const columnsMap = buildOptionsColumnsFlatMap({}, initedColumns);
  const formType = mode === "form" ? "form" : `${mode}Form`;
  return buildForm(userOptions, formType, columnsMap);
}

function buildColumns(userOptions: CrudOptions) {
  forEach(userOptions.columns, (value: any, key: any) => {
    value.key = key;
  });
  const columns = setupOptionsColumns(cloneDeep(userOptions.columns), userOptions);
  userOptions.columns = columns;
  const columnsFlatMap = buildOptionsColumnsFlatMap({}, columns);

  userOptions.table.columns = buildTableColumns(cloneDeep(columns));
  userOptions.table.columnsMap = buildTableColumnsFlatMap({}, userOptions.table.columns);
  merge(userOptions.toolbar, {
    columnsFilter: {
      originalColumns: cloneDeep(userOptions.table.columns)
    }
  });
  userOptions.form = buildForm(userOptions, "form", columnsFlatMap);
  userOptions.addForm = buildForm(userOptions, "addForm", columnsFlatMap);
  userOptions.editForm = buildForm(userOptions, "editForm", columnsFlatMap);
  userOptions.viewForm = buildForm(userOptions, "viewForm", columnsFlatMap, (form) => {
    // 单独处理viewForm的component
    forEach(form.columns, (value: any) => {
      if (!value.component) {
        value.component = {};
      }
      value.component.disabled = true;
    });
  });
  //处理searchColumns， 只从form里面复制component和valueChange
  userOptions.search = buildSearchForm(userOptions, "search", columnsFlatMap);

  //处理editable form
  if (userOptions.table.editable) {
    userOptions.table.editable.addForm = merge(userOptions.addForm.columns, userOptions.table.editable.addForm);
    userOptions.table.editable.editForm = merge(userOptions.editForm.columns, userOptions.table.editable.editForm);
  }
  return userOptions;
}

export function forEachTableColumns(columns: TableColumnsProps, callback: (col: ColumnProps, key: string) => void) {
  forEach(columns, (item: any, key: any) => {
    if (!item.key) {
      item.key = key;
    }
    if (item.children) {
      forEachTableColumns(item.children, callback);
    } else {
      callback(item, key);
    }
  });
}

export function forEachColumns(
  columns: CompositionColumns,
  callback: (col: ColumnCompositionProps, key: string) => void
) {
  forEach(columns, (item: any, key: any) => {
    if (!item.key) {
      item.key = key;
    }
    if (item.children) {
      forEachColumns(item.children, callback);
    } else {
      callback(item, key);
    }
  });
}

export function useColumns() {
  return {
    buildFormOptions,
    buildColumns,
    registerMergeColumnPlugin,
    forEachColumns
  };
}
