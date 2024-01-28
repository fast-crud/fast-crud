/**
 * compute参数方法的参数
 */
export type ComputeContext<R = any> = {
  /**
   * 行数据
   */
  row?: R;
  /**
   * 表单数据
   */
  form?: R;
  /**
   * 当前行号
   */
  index?: number;
  /**
   * 当前编辑对话框模式[view/add/edit]
   */
  mode?: string;
  /**
   * 其他参数
   */
  attrs?: any;
  /**
   * 获取对应字段组件的ref
   * @param key
   */
  getComponentRef?: (key?: string) => any | Promise<any>;
  /**
   * 其他配置
   */
  [key: string]: any;
};
