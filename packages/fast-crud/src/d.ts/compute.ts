export type ComputeContext = {
  row?: any;
  form?: any;
  index?: number;
  mode?: string;
  attrs?: any;
  getComponentRef?: (key?: string) => any | Promise<any>;
  /**
   * 其他配置
   */
  [key: string]: any;
};
