//https://cn.vuejs.org/guide/typescript/composition-api.html#typing-component-props
//https://github.com/vuejs/core/issues/4294
//vue限制，无法通过import直接引入interface
import { TableColumnsProps } from "../../../d";
import { ShallowRef } from "vue";
export type ColumnsFilterProps = {
  container?: {
    is?: string | ShallowRef;
  };
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
  columns?: TableColumnsProps;

  /**
   * 原始列数据
   */
  originalColumns?: TableColumnsProps;
  /**
   * 是否保存设置
   */
  storage?: boolean | string;
  /**
   * 文本设置
   */
  text?: {
    //标题
    title?: string;
    //固定
    fixed?: string;
    //排序
    order?: string;
    // 重置
    reset?: string;
    //确认
    confirm?: string;
    //未命名
    unnamed?: string;
  };
};

export type ColumnsFilterItem = {
  key: string;
  title: string;
  fixed: boolean | string;
  show: boolean;
  __show: boolean;
  __disabled: boolean;
};

export const ColumnsFilterProvideKey = "ColumnsFilterContext";
