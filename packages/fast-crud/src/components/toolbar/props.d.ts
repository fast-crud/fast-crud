import { ColumnsFilterComponentProps } from "/src/components/toolbar/fs-table-columns-filter/props";
import { ButtonProps } from "/src/d.ts";

export interface ToolbarComponentProps {
  /**
   * 按钮配置
   * {
   *   search:{}, 查询
   *   refresh:{}, 刷新
   *   compact:{}, 紧凑模式
   *   columns:{} 列设置
   * }
   */
  buttons?: {
    /**
     * 按钮key: 按钮配置
     */
    [key: string]: ButtonProps;
  };

  /**
   * 当前是否显示查询。
   * 注意：如果要隐藏search，请配置crudOptions.search.show=false
   */
  search?: boolean;

  columnsFilter?: ColumnsFilterComponentProps;

  /**
   * 当前是否紧凑模式
   */
  compact?: boolean;
  /**
   * 列配置
   */
  columns?: any[];
  /**
   * 是否保存用户列设置
   * 传string则表示传入缓存的主key
   */
  storage?: boolean | string;
  /**
   * 插槽
   */
  slots?: {
    [key: string]: Function;
  };
}
