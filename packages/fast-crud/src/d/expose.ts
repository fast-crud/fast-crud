import {
  CompositionColumns,
  CrudBinding,
  FormProps,
  Page,
  PageQuery,
  PageRes,
  RemoveProps,
  UserPageQuery
} from "./crud";
import { Ref } from "vue";
import { EditableOnEnabledProps } from "../use";
import {
  EditableCellActiveProps,
  EditableEachCellsOpts,
  EditableEachRowsOpts,
  EditableRow
} from "/src/components/crud/editable/d";

export type SearchOptions = {
  silence?: boolean;
};

export type DoValueResolveProps = {
  form: any;
};

export class SetFormDataOptions {
  /**
   * 是否执行valueChange
   */
  valueChange?: boolean;

  mergeForm?: boolean;
}

export type DoRefreshProps = {
  goFirstPage?: boolean;
  silence?: boolean;
};

/**
 * crudExpose
 */
export type CrudExpose = {
  crudRef: Ref;
  crudBinding: Ref<CrudBinding>;
  /**
   * 获取FsFormWrapper的实例
   */
  getFormWrapperRef: () => any;
  /**
   * 获取FsFormRef
   */
  getFormRef: () => any;
  /**
   * 获取表单数据，仅表单打开时有效
   */
  getFormData: () => any;

  /**
   * 设置当前表单数据，仅表单打开时有效
   *  data: 表单数据
   */
  setFormData: (data: any, options?: SetFormDataOptions) => any;

  /**
   * 获取表单组件实例，仅表单打开时有效
   * key: 字段key
   * isAsync: 是否异步获取，传true时，此方法返回promise（当组件是异步组件<extends中的组件>时，第一次获取会为空，所以需要异步等待加载完成后才能获取）
   */
  getFormComponentRef: (key: string, isAsync?: boolean) => any;
  /**
   * 执行valueBuilder
   * @param rows 表格数据列表
   */
  doValueBuilder: (rows: any[], columns?: CompositionColumns) => void;
  /**
   * 执行valueResolve
   * @param props { form }
   */
  doValueResolve: (props: DoValueResolveProps, columns?: CompositionColumns) => void;
  /**
   * 刷新列表数据
   */
  doRefresh: (props?: DoRefreshProps) => Promise<void>;
  /**
   * 翻页
   */
  doPageTurn: (no: number) => void;
  /**
   * 查询按钮点击，执行查询
   * @param opts {form, goFirstPage =true,mergeForm=false}
   */
  doSearch: (props: DoSearchProps) => Promise<void>;

  /**
   * 构建page查询参数
   * @param pageQuery
   */
  buildPageQuery(pageQuery: PageQuery): UserPageQuery;

  /**
   * 获取当前分页参数
   */
  getPage(): Page;
  /**
   * 执行搜索，返回页面数据
   * @param pageQuery
   */
  search: (pageQuery: PageQuery, options?: SearchOptions) => Promise<PageRes>;
  /**
   * 删除行按钮点击
   * @param context = {index / row}
   */
  doRemove: (context: DoRemoveContext, opts?: RemoveProps) => Promise<void>;
  /**
   * 打开编辑对话框
   * @param props = {index / row}
   */
  openEdit: (context: OpenEditContext, formOpts?: OpenDialogProps) => Promise<any>;
  /**
   * 打开添加对话框
   *  @param props = {index?,row?}
   */
  openAdd: (context: OpenEditContext, formOpts?: OpenDialogProps) => Promise<any>;
  /**
   * 打开查看对话框
   *  @param props = {index,row}
   */
  openView: (context: OpenEditContext, formOpts?: OpenDialogProps) => Promise<any>;
  /**
   * 打开对话框
   * @param formOpts = {...formWrapper.open的自定义参数}
   */
  openDialog: (formOpts: OpenDialogProps) => Promise<any>;

  _openDialog: (mode: string, context: OpenEditContext, formOpts?: OpenDialogProps) => Promise<any>;

  /**
   *  获取查询组件ref
   */
  getSearchRef: () => any;

  /**
   * 触发查询表单校验
   */
  doSearchValidate: () => void;
  /**
   * 获取查询表单数据
   */
  getSearchFormData: () => any;
  /**
   * 获取查询表单校验成功的数据
   */
  getSearchValidatedFormData: () => any;
  /**
   * 重新设置查询表单数据
   */
  setSearchFormData: (props: SetSearchFormDataProps) => void;

  /**
   * 获取toolbar组件Ref
   */
  getToolbarRef: () => any;

  /**
   * 获取列设置组件Ref
   */
  getColumnsFilterRef: () => any;

  /**
   * 获取列设置的原始列配置Ref
   * 可以修改列设置的原始配置
   */
  getColumnsFilterOriginalColumnsRef: () => any;

  /**
   * 获取列设置的每列配置Ref
   * 可以修改列设置的每列配置
   */
  getColumnsFilterColumnsRef: () => any;
  /**
   * 获取FsTable的实例
   */
  getTableRef: () => any;

  /**
   * 获取x-table的实例
   */
  getBaseTableRef: () => any;

  /**
   * 获取表格数据
   */
  getTableData: () => any[];
  /**
   * 重新设置表格数据
   */
  setTableData: (data: any[]) => void;
  /**
   * 插入行
   * @param index
   * @param row
   */
  insertTableRow: (index: number, row: Object) => void;
  /**
   * 更新行
   * @param index
   * @param row
   */
  updateTableRow: (index: number, row: Object, merge?: boolean) => void;
  /**
   * 删除行
   * @param index
   */
  removeTableRow: (index: number) => void;

  /**
   * 获取表格数据某一行
   */
  getTableDataRow: (index: number) => any;
  /**
   * 选中某一行
   * @param context = {row}
   */
  doSelectCurrentRow: (context: SelectCurrentRowProps) => void;
  /**
   * 行编辑
   */
  editable: Editable;
};
export type EditableAddRowOptions = {
  row?: any;
  active?: boolean;
};
export type EditableActiveColsOptions = {
  cols: string[];
} & EditableCellActiveProps;
export type Editable = {
  enable(opts: any, onEnabled?: (opts: EditableOnEnabledProps) => void): Promise<void>;
  /**
   * 禁用编辑
   */
  disable(): void;
  /**
   * 激活所有编辑
   */
  active(opts: EditableCellActiveProps): void;
  /**
   * 退出编辑
   */
  inactive(): void;

  /**
   * 取消所有编辑
   */
  cancel(): void;

  /**
   * 保存所有编辑，不提交到后台，仅让本地保存
   */
  persist(): void;
  /**
   * 添加行
   */
  addRow(opts?: EditableAddRowOptions): void;
  /**
   * 编辑cols
   * @param opts
   */
  activeCols(opts: EditableActiveColsOptions): void;
  /**
   * 还原，取消编辑
   */
  resume(): void;
  removeRow(editableId: any): void;
  getEditableRow(editableId: any): EditableRow;
  doSaveRow(opts: { editableId?: any; row?: any }): Promise<void>;
  doCancelRow(opts: { editableId?: any; row?: any }): Promise<void>;
  doRemoveRow(opts: { editableId?: any; row?: any }): Promise<void>;
  getInstance(): any;
  eachCells(opts: EditableEachCellsOpts): void;
  eachRows(opts: EditableEachRowsOpts): void;
  validate(): Promise<boolean>;
  /**
   * 获取可提交数据
   */
  getTableData(): any[];
};
/**
 * index or row 必须传一个
 */
export type OpenEditContext = {
  /**
   * 行索引, 行索引或row，必传一个
   */
  index?: number;
  /**
   * 行数据，默认会赋值给initialForm作为初始值
   */
  row?: any;
};

/**
 * crudExpose.openDialog 打开对话框参数
 */
export type OpenDialogProps = {
  /**
   * 是否新创建一个实例打开
   * 当使用新建实例打开时，无法通过getFormWrapperRef获取到表单ref，你可以从openDialog的返回值中拿到ref
   * const {openDialog} = useFormWrapper()
   * const wrapperRef = await openDialog(props:OpenDialogProps)
   */
  newInstance?: boolean;
  /**
   * 对话框id，不传则随机生成，新实例在关闭时不会被销毁，使用相同id的form重复打开会被覆盖
   */
  id?: string;
} & FormProps;

/**
 * crudExpose.setSearchFormData参数
 */
export type SetSearchFormDataProps = { form: any; mergeForm?: boolean; triggerSearch?: boolean; refWarning?: boolean };
/**
 * crudExpose.doRemove参数
 */
export type DoRemoveContext = { index?: number; row?: any };
/**
 * crudExpose.doSearch参数
 */
export type DoSearchProps = { form: any; goFirstPage?: boolean; mergeForm?: boolean };
/**
 * crudExpose.doSelectCurrentRow参数
 */
export type SelectCurrentRowProps = { row: any };
