import { CrudBinding, FormProps } from "./crud";
import { Ref } from "vue";

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
   * 获取表单数据
   */
  getFormData: () => any;
  /**
   * 获取表单组件实例
   * key: 字段key
   * isAsync: 是否异步获取，传true时，此方法返回promise（当组件是异步组件<extends中的组件>时，第一次获取会为空，所以需要异步等待加载完成后才能获取）
   */
  getFormComponentRef: (key: string, isAsync: boolean) => any;
  /**
   * 执行valueBuilder
   * @param records 表格数据列表
   */
  doValueBuilder: (records: any[], columns?: any) => void;
  /**
   * 执行valueResolve
   * @param context { form }
   */
  doValueResolve: (context: { form: any }, columns?: any) => void;
  /**
   * 刷新列表数据
   */
  doRefresh: () => Promise<void>;
  /**
   * 翻页
   */
  doPageTurn: (no: number) => void;
  /**
   * 查询按钮点击，执行查询
   * @param opts {form, goFirstPage =true,mergeForm=false}
   */
  doSearch: (opts: DoSearchProps) => Promise<void>;
  /**
   * 删除行按钮点击
   * @param context = {index,row,...} , delRequest的请求参数
   */
  doRemove: (context: DoRemoveProps) => Promise<void>;
  /**
   * 打开编辑对话框
   * @param context = {index,row,...formWrapper.open的自定义参数}
   */
  openEdit: (context: OpenEditProps) => Promise<any>;
  /**
   * 打开添加对话框
   *  @param context = {row,...formWrapper.open的自定义参数}
   */
  openAdd: (context: OpenAddProps) => Promise<any>;
  /**
   * 打开查看对话框
   *  @param context = {index,row,...formWrapper.open的自定义参数}
   */
  openView: (context: OpenEditProps) => Promise<any>;
  /**
   * 打开对话框
   * @param context = {...formWrapper.open的自定义参数}
   */
  openDialog: (context: OpenDialogProps) => Promise<any>;

  /**
   *  获取查询组件ref
   */
  getSearchRef: () => any;
  /**
   * 获取查询表单数据
   * @param context
   */
  getSearchFormData: () => any;
  /**
   * 重新设置查询表单数据
   */
  setSearchFormData: (context: SetSearchFormDataProps) => void;
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
  editable: any;
};

export type OpenEditProps = {
  /**
   * 行索引
   */
  index: number;
  /**
   * 行数据，默认会赋值给initialForm作为初始值
   */
  row: any;
} & OpenDialogProps;

export type OpenAddProps = {
  /**
   * 行数据，默认会赋值给initialForm作为初始值
   */
  row?: any;
} & OpenDialogProps;

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
export type SetSearchFormDataProps = { form: any; mergeForm?: boolean };
/**
 * crudExpose.doRemove参数
 */
export type DoRemoveProps = { index: number; row: any };
/**
 * crudExpose.doSearch参数
 */
export type DoSearchProps = { form: any; goFirstPage?: boolean; mergeForm?: boolean };
/**
 * crudExpose.doSelectCurrentRow参数
 */
export type SelectCurrentRowProps = { row: any };
