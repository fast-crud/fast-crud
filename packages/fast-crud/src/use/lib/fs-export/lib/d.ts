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
  columns?: ExportColumn[];
  data?: any[];
  filename?: string;
  noHeader?: boolean;
};
export type ExportColumn = {
  key: string;
  title: string;
};

export type ExportLibColumn = {
  prop: string;
  label: string;
};
