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
} & CsvParams;
export type CsvParams = {
  columns: CsvColumn[];
  data: any[];
  title?: string;
  noHeader?: boolean;
};
export type CsvColumn = {
  prop: string;
  label: string;
};
