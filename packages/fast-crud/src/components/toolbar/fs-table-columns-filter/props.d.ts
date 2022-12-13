export interface ColumnsFilterComponentProps {
  /**
   * 是否显示列设置抽屉
   */
  show?: boolean;
  /**
   * 模式，default,simple
   */
  mode?: string;
  /**
   * 列数据
   */
  columns?: any[];
  /**
   * 是否保存设置
   */
  storage?: boolean | string;
  /**
   * 文本设置
   */
  text?: {
    /**
     * 标题
     */
    title?: string;
    /**
     * 固定
     */
    fixed?: string;
    /**
     * 排序
     */
    order?: string;
    /**
     * 重置
     */
    reset?: string;
    /**
     * 确认
     */
    confirm?: string;
    /**
     * 未命名
     */
    unnamed?: string;
  };
}
