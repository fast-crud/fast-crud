import { Ref } from "vue";
import { ColumnProps, EditableProps, EditableUpdateCellRequest, FormItemProps } from "/src/d";
import { ComputedRef } from "vue/dist/vue";
import Schema from "async-validator";

export type EditableTable = {
  options: Ref<EditableProps>;
  setupEditable: (data?: any[]) => void;
  inactive: () => void;
  active: () => void;
  saveEach: () => Promise<void>;
  cancelAll: () => void;
  persist: () => void;
  submit: (call: (opts: any) => any) => Promise<void>;
  resume: () => void;
  addRow: () => void;
  removeRow: (editableId: any) => void;
  getEditableRow: (editableId: any) => void;
  activeCols: (opts: { cols: string[] }) => void;
  hasDirty: () => void;
  getEditableCell: (editableId: any, key: string) => EditableCell;
  eachRows: (call: (opts: EditableEachRowsOpts) => void) => void;
  eachCells: (call: (opts: EditableEachCellsOpts) => void) => void;
  validate: () => Promise<any>;
  getTableData: () => any[];
};
export type EditableCellActiveProps = {
  showAction?: boolean;
  exclusive?: boolean;
  exclusiveEffect?: "cancel" | "save";
};
export type EditableCell = {
  isEditing: boolean;
  loading: boolean;
  mode: string;
  activeTrigger: "onClick" | "onDbClick" | false;
  isEditable: () => boolean;
  isChanged: () => boolean;
  getForm: () => FormItemProps;
  active: (opts?: EditableCellActiveProps) => void;
  inactive: () => void;
  resume: () => void;
  persist: () => void;
  save: () => Promise<void>;
  cancel: () => void;
  oldValue: any;
  newValue: any;
  column: ColumnProps;
  updateCell: ComputedRef<EditableUpdateCellRequest>;
  showAction: boolean;
  validateErrors?: any[];
};

export type EditableRow = {
  isAdd?: boolean;
  inactive: () => void;
  active: () => void;
  isEditing: boolean;
  cells: Record<string, EditableCell>;
  persist: () => void;
  resume: () => void;
  cancel: () => void;
  save: (opts: { doSave: (opts: any) => Promise<void> }) => Promise<void>;
  loading: boolean;
  /**
   * 获取可以提交的行数据
   */
  getRowData: () => any;
  rowData: any;
  editableId: any;
  validate: (row?: any) => Promise<any>;
  validator?: Schema;
};

export type EditableRowData = {
  __editableRowId__: number;
  [key: string]: any;
};

export type EditableEachCellsOpts = {
  rowData: any;
  row: EditableRow;
  cells: Record<string, EditableCell>;
  cell: EditableCell;
  key: string;
};

export type EditableEachRowsOpts = {
  rowData: any;
  row: EditableRow;
  cells: Record<string, EditableCell>;
};
