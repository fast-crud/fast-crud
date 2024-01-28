import { ColumnCompositionProps, ColumnProps, RowRecord } from "../../../d";

export type ExportUtil = {
  csv: (params: CsvParams) => Promise<void>;
  excel: (params: ExcelParams) => Promise<void>;
  txt: (params: TxtParams) => Promise<void>;
};
export type TxtParams = {
  text: string;
} & CsvParams;
export type ExcelParams = {
  header?: any;
  merges?: any[];
  columns?: ExportColumn[];
  data?: any[];
  filename?: string;
};
export type CsvParams = {
  columns?: ExportColumn[];
  data?: any[];
  filename?: string;
  noHeader?: boolean;
  separator?: string;
  quoted?: boolean;
};
/**
 * 导出列配置
 */
export type ExportColumn<R = any> = {
  columnProps?: ColumnProps<R>;
  key: string;
  title: string;
  width?: number;
  [key: string]: any;
};

export type ExportLibColumn = {
  prop: string;
  label: string;
};

export type ImportData = {
  data: any[];
  columns: ExportColumn[];
};

export type ImportUtil = {
  csv: (file: File) => Promise<ImportData>;
};
