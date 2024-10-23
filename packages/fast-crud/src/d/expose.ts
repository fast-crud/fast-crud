import {
  CompositionColumns,
  CrudBinding,
  FormProps,
  Page,
  PageQuery,
  PageRes,
  RemoveProps,
  RowRecord,
  UserPageQuery
} from "./crud";
import { Ref } from "vue";
import { Editable } from "./expose-editable";

export type SearchOptions = {
  silence?: boolean;
};

export type DoValueResolveProps<R = any> = {
  form: R;
};

export class SetFormDataOptions {
  /**
   * 是否执行valueChange
   */
  valueChange?: boolean;

  mergeForm?: boolean;
}

/**
 * doRefresh方法的参数
 */
export type DoRefreshProps = {
  /**
   * 刷新后是否跳转到首页
   */
  goFirstPage?: boolean;
  /**
   *  是否静默刷新，不显示loading，没有任何外在表现
   */

  silence?: boolean;
  /**
   *  是否滚动到顶部
   */
  scrollTop?: boolean;
};

/**
 * crudExpose
 */
export type CrudExpose<R = any> = {
  crudRef: Ref;
  crudBinding: Ref<CrudBinding<R>>;
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
  getFormData: () => R;

  /**
   * 设置当前表单数据，仅表单打开时有效
   *  data: 表单数据
   */
  setFormData: (data: R, options?: SetFormDataOptions) => any;

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
  doValueBuilder: (rows: R[], columns?: CompositionColumns<R>) => void;
  /**
   * 执行valueResolve
   * @param props { form }
   */
  doValueResolve: (props: DoValueResolveProps<R>, columns?: CompositionColumns<R>) => void;
  /**
   * 刷新列表数据
   */
  doRefresh: (props?: DoRefreshProps) => Promise<void>;
  /**
   * 翻页, 注意，需要另外手动调用doRefresh才会刷新数据
   */
  doPageTurn: (no: number) => void;
  /**
   * 查询按钮点击，执行查询
   * @param opts {form, goFirstPage =true,mergeForm=false}
   */
  doSearch: (props: DoSearchProps<R>) => Promise<void>;

  /**
   * 构建page查询参数
   * @param pageQuery
   */
  buildPageQuery(pageQuery: PageQuery<R>): UserPageQuery<R>;

  /**
   * 获取当前分页参数
   */
  getPage(): Page;
  /**
   * 执行搜索，返回页面数据
   * @param pageQuery
   */
  search: (pageQuery: PageQuery<R>, options?: SearchOptions) => Promise<PageRes<R>>;
  /**
   * 删除行按钮点击
   * @param context = {index / row}
   */
  doRemove: (context: DoRemoveContext<R>, opts?: RemoveProps<R>) => Promise<any>;

  /**
   * 复制行，以当前行数据打开新增对话框
   */
  openCopy: (context: OpenEditContext<R>, formOpts?: OpenDialogProps<R>) => Promise<any>;
  /**
   * 打开编辑对话框
   */
  openEdit: (context: OpenEditContext, formOpts?: OpenDialogProps<R>) => Promise<any>;
  /**
   * 打开添加对话框
   */
  openAdd: (context: OpenEditContext, formOpts?: OpenDialogProps<R>) => Promise<any>;
  /**
   * 打开查看对话框
   */
  openView: (context: OpenEditContext, formOpts?: OpenDialogProps) => Promise<any>;
  /**
   * 打开对话框
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
  setSearchFormData: (props: SetSearchFormDataProps<R>) => void;

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
  getTableData: () => R[];
  /**
   * 重新设置表格数据
   */
  setTableData: (data: R[]) => void;
  /**
   * 插入行
   * @param index
   * @param row
   */
  insertTableRow: (index: number, row: R) => void;
  /**
   * 更新行
   * @param index
   * @param row
   */
  updateTableRow: (index: number, row: R, merge?: boolean) => void;
  /**
   * 删除行
   * @param index
   */
  removeTableRow: (index: number) => void;

  /**
   * 获取表格数据某一行,不支持树形结构
   */
  getTableDataRow: (index: number) => any;

  /**
   * 根据rowKey删除某一行
   * @param rowKey
   */
  removeTableRowByRowKey: (rowKey: any, data?: R[]) => boolean;
  /**
   * 选中某一行
   * @param context = {row}
   */
  doSelectCurrentRow: (context: SelectCurrentRowProps<R>) => void;
  /**
   * 行编辑
   */
  editable: Editable;
};

/**
 * index or row 必须传一个
 */
export type OpenEditContext<R = any> = {
  /**
   * 行索引, 行索引或row，必传一个
   */
  index?: number;
  /**
   * 行数据，默认会赋值给initialForm作为初始值
   */
  row?: R;
};

/**
 * crudExpose.openDialog 打开对话框参数
 */
export type OpenDialogProps<R = any> = {
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
} & FormProps<R>;

/**
 * crudExpose.setSearchFormData参数
 */
export type SetSearchFormDataProps<R = any> = {
  form: R;
  mergeForm?: boolean;
  triggerSearch?: boolean;
  refWarning?: boolean;
};
/**
 * crudExpose.doRemove参数
 */
export type DoRemoveContext<R = any> = { index?: number; row?: R };
export type OnAfterRemoveContext<R = any> = DoRemoveContext<R> & { res: any };
/**
 * crudExpose.doSearch参数
 */
export type DoSearchProps<R = any> = { form: R; goFirstPage?: boolean; mergeForm?: boolean };
/**
 * crudExpose.doSelectCurrentRow参数
 */
export type SelectCurrentRowProps<R = any> = { row: R };
