import { useMerge } from "./use-merge";
import types from "../types";
import { Constants } from "../utils/util.constants";
import defaultCrudOptions from "./default-crud-options";
import _ from "lodash-es";
import { reactive } from "vue";
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
  TypeMap
} from "../d.ts";
import { UseFsContext } from "./use-crud";

const { merge, cloneDeep } = useMerge();
// mergeColumnPlugin 注册

export type MergeColumnPlugin = {
  name: string;
  handle: (columnProps: any, crudOptions: any) => {};
  order: number;
};

const mergeColumnPlugins: MergeColumnPlugin[] = [];

export function registerMergeColumnPlugin(plugin: MergeColumnPlugin) {
  _.remove(mergeColumnPlugins, (item) => {
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
    if (columnProps.type === "text") {
      viewFormColumn.render = (context: ScopeContext) => {
        const { value } = context;
        return <span>{value}</span>;
      };
    }
    merge(columnProps, { viewForm: viewFormColumn });
    return columnProps;
  }
};
registerMergeColumnPlugin({ name: "type", handle: mergeColumnType, order: -2 });
registerMergeColumnPlugin({ name: "dict", handle: mergeColumnDict, order: -1 });
registerMergeColumnPlugin(viewFormUseCellComponentPlugin);

/**
 * 排序
 * @param arr
 */
function doArraySort(arr: any) {
  return _.sortBy(arr, (item) => {
    return item.order ?? Constants.orderDefault;
  });
}

/**
 * 初始化用户配置的列
 * 将dict和fieldType合并
 * @param columns
 * @param userOptions
 */
function setupOptionsColumns(columns: { [key: string]: ColumnCompositionProps }, userOptions: CrudOptions) {
  const initedColumns: any = {};
  _.forEach(columns, (item, key) => {
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
function buildOptionsColumnsMap(map: CompositionColumns = {}, columns: CompositionColumns) {
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
  return reactive(tableColumn);
}

/**
 * 构建列表表头配置
 * @param columns
 */
function buildTableColumns(columns: CompositionColumns) {
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
function buildTableColumnsMap(map: TypeMap<ColumnProps> = {}, columns: ColumnProps[]) {
  _.forEach(columns, (item) => {
    map[item.key] = item;
    if (item.children) {
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
function buildFormColumns(columns: CompositionColumns, formType: string) {
  // 合并form
  const formColumns: any = {};
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
function buildForm(
  baseOptions: CrudOptions,
  formType: string,
  columnsMap: CompositionColumns,
  onComplete?: (form: any) => void
) {
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
function buildSearchForm(baseOptions: CrudOptions, formType = "search", columnsMap: CompositionColumns) {
  const searchColumns = buildFormColumns(columnsMap, formType);
  const formColumnsForSearch: any = {};
  _.forEach(cloneDeep(baseOptions.form.columns), (item, key) => {
    formColumnsForSearch[key] = _.pick(item, ["component", "valueChange", "title", "key", "label"]);
  });

  return merge({ columns: formColumnsForSearch }, { columns: searchColumns }, baseOptions.search);
}

function buildFormOptions(crudOptions: DynamicallyCrudOptions, context?: UseFsContext): FormProps {
  const { t } = useI18n();
  context = context || {};
  const userOptions = merge(
    defaultCrudOptions.defaultOptions({ t }),
    defaultCrudOptions.commonOptions({ crudOptions, context, crudExpose: null }),
    crudOptions
  );
  const initedColumns = setupOptionsColumns(cloneDeep(userOptions.columns), userOptions);
  const columnsMap = buildOptionsColumnsMap({}, initedColumns);
  return buildForm(userOptions, "form", columnsMap);
}

function buildColumns(userOptions: CrudOptions) {
  _.forEach(userOptions.columns, (value, key) => {
    value.key = key;
  });
  const columns = setupOptionsColumns(cloneDeep(userOptions.columns), userOptions);
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

export function forEachColumns(
  columns: CompositionColumns,
  callback: (col: ColumnCompositionProps, key: string) => void
) {
  _.forEach(columns, (item, key) => {
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
