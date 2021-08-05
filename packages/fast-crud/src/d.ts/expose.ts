export type CrudExpose = {
  crudRef;
  crudBinding;
  /**
   * 获取FsFormWrapper的实例
   */
  getFormWrapperRef;
  /**
   * 获取FsFormRef
   */
  getFormRef;
  /**
   * 获取表单数据
   */
  getFormData;
  /**
   * 获取表单组件实例
   */
  getFormComponentRef: (key: string) => any;
  /**
   * 执行valueBuilder
   */
  doValueBuilder;
  /**
   * 执行valueResolve
   */
  doValueResolve;
  /**
   * 刷新列表数据
   */
  doRefresh;
  /**
   * 翻页
   */
  doPageTurn;
  /**
   * 查询按钮点击，执行查询
   */
  doSearch;
  /**
   * 删除行按钮点击
   */
  doRemove;
  /**
   * 打开编辑对话框
   */
  openEdit;
  /**
   * 打开添加对话框
   */
  openAdd;
  /**
   * 打开查看对话框
   */
  openView;
  /**
   * 打开对话框
   */
  openDialog;
  /**
   * 获取查询表单数据
   */
  getSearchFormData;
  /**
   * 重新设置查询表单数据
   */
  setSearchFormData;
  /**
   * 获取FsTable的实例
   */
  getTableRef;
  /**
   * 获取表格数据
   */
  getTableData;
  /**
   * 重新设置表格数据
   */
  setTableData;
  getTableDataRow;
  doSelectCurrentRow;
  editable: any;
};
