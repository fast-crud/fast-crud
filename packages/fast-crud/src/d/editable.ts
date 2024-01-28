import { Ref, ComputedRef } from "vue";
import { ColumnProps, EditableProps, EditableUpdateCellRequest, FormItemProps, RowRecord, ScopeContext } from "./crud";
import Schema from "async-validator";
import { ValidateFieldsError } from "async-validator/dist-types/interface";

export type EditableValidateResult = boolean | ValidateFieldsError;
export type EditableTable<R = any> = {
  options: Ref<EditableProps<R>>;
  disabled?: boolean;
  setupEditable: (data?: R[]) => void;
  inactive: () => void;
  active: () => void;
  saveEach: () => Promise<void>;
  cancelAll: () => void;
  persist: () => void;
  resume: () => void;
  addRow: () => void;
  removeRow: (editableId: any) => void;
  getEditableRow: (editableId: any) => void;
  activeCols: (opts: { cols: string[] }) => void;
  hasDirty: () => void;
  getEditableCell: (editableId: any, key: string) => EditableCell<R>;
  eachRows: (callback: (opts: EditableEachRowsOpts<R>) => void) => void;
  eachCells: (callback: (opts: EditableEachCellsOpts<R>) => void) => void;
  validate: () => Promise<EditableValidateResult>;
  getCleanTableData: (data?: R[]) => any[];
  getActiveRows: () => EditableRow<R>[];
};
export type EditableCellActiveProps = {
  showAction?: boolean;
  exclusive?: boolean;
  exclusiveEffect?: "cancel" | "save";
};
export type EditableCell<R = any> = {
  isEditing: boolean;
  loading: boolean;
  mode: string;
  activeTrigger: "onClick" | "onDbClick" | false;
  isEditable: () => boolean;
  isChanged: () => boolean;
  getForm: () => FormItemProps<R>;
  active: (opts?: EditableCellActiveProps) => void;
  inactive: () => void;
  resume: () => void;
  persist: () => void;
  save: () => Promise<void>;
  cancel: () => void;
  oldValue: any;
  newValue: any;
  column: ColumnProps;
  updateCell: ComputedRef<EditableUpdateCellRequest<R>>;
  showAction: boolean;
  validateErrors?: any[];
};

export type EditableSaveRowContext<R = any> = { isAdd: boolean; row: R; setData: (data: R) => void };
export type EditableRow<R = any> = {
  isAdd?: boolean;
  inactive: () => void;
  active: () => void;
  isEditing: boolean;
  cells: Record<string, EditableCell<R>>;
  persist: () => void;
  resume: () => void;
  cancel: () => void;
  save: (opts: { doSave: (opts: EditableSaveRowContext<R>) => Promise<void> }) => Promise<void>;
  loading: boolean;
  /**
   * 获取可以提交的行数据
   */
  getRowData: () => R;
  rowData: R;
  editableId: any;
  validate: (row?: R) => Promise<EditableValidateResult>;
  validator?: Schema;
};

export type EditableRowData = {
  __editableRowId__: number;
  [key: string]: any;
};

export type EditableEachCellsOpts<R = any> = {
  rowData: R;
  row: EditableRow<R>;
  cells: Record<string, EditableCell<R>>;
  cell: EditableCell<R>;
  key: string;
};

export type EditableEachRowsOpts<R = any> = {
  rowData: any;
  row: EditableRow<R>;
  cells: Record<string, EditableCell<R>>;
};
