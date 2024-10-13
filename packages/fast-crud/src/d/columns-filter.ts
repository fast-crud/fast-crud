import { Ref } from "vue";
import { TableColumnsProps } from "../d/crud";

export type ColumnsFilterItem = {
  key: string;
  title: string;
  fixed: boolean | string;
  show: boolean;

  //treeKey  parentKey.itemKey
  __key?: string;
  __show: boolean;
  __disabled: boolean;

  __parent?: ColumnsFilterItem;

  children?: ColumnsFilterItem[];
};

export type ColumnsFilterContext = {
  originalColumns: Ref<TableColumnsProps>;
  originalColumnsMap: Ref<Record<string, ColumnsFilterItem>>;
  currentColumns: Ref<ColumnsFilterItem[]>;
  text: Ref;
  active: Ref;
  submit: () => void;
  reset: () => void;
};

export const ColumnsFilterProvideKey = "ColumnsFilterContext";
