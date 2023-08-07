import { Ref } from "vue";

export type ColumnsFilterItem = {
  key: string;
  title: string;
  fixed: boolean | string;
  show: boolean;
  __show: boolean;
  __disabled: boolean;
};

export type ColumnsFilterContext = {
  originalColumns: Ref;
  currentColumns: Ref;
  text: Ref;
  active: Ref;
};

export const ColumnsFilterProvideKey = "ColumnsFilterContext";
