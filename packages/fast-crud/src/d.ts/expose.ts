export type CrudExpose = {
  crudRef;
  crudBinding;
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
  doValueBuilder: (records, columns?: Object) => void;
  /**
   * 执行valueResolve
   * @param context { form }
   */
  doValueResolve: (context: { form: any }, columns?: Object) => void;
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
  doSearch: (opts: { form: any; goFirstPage?: boolean; mergeForm?: boolean }) => Promise<void>;
  /**
   * 删除行按钮点击
   * @param context = {index,row,...} , delRequest的请求参数
   */
  doRemove: (context) => Promise<void>;
  /**
   * 打开编辑对话框
   * @param context = {index,row,...formWrapper.open的自定义参数}
   */
  openEdit: (context) => Promise<void>;
  /**
   * 打开添加对话框
   *  @param context = {row,...formWrapper.open的自定义参数}
   */
  openAdd: (context) => Promise<void>;
  /**
   * 打开查看对话框
   *  @param context = {index,row,...formWrapper.open的自定义参数}
   */
  openView: (context) => Promise<void>;
  /**
   * 打开对话框
   * @param context = {...formWrapper.open的自定义参数}
   */
  openDialog: (context) => Promise<void>;

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
  setSearchFormData: (context: { form; mergeForm?: boolean }) => void;
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
  getTableData: () => [];
  /**
   * 重新设置表格数据
   */
  setTableData: ([]) => void;
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
  doSelectCurrentRow: (context: { row }) => void;
  /**
   * 行编辑
   */
  editable: any;
};
