import ExportCsv from "./_export-csv";
import Csv from "./_csv";
import * as Excel from "./_export2Excel";
import FileSaver from "file-saver";

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
export const exportUtil: ExportUtil = {
  // 导出 csv
  csv(params: CsvParams) {
    return new Promise((resolve, reject) => {
      // 默认值
      const paramsDefault: CsvParams = {
        columns: [],
        data: [],
        title: "table",
        noHeader: false
      };
      // 合并参数
      const _params: CsvParams = Object.assign({}, paramsDefault, params);
      // 生成数据
      const data = Csv(_params.columns, _params.data, params, _params.noHeader);
      // 下载数据
      ExportCsv.download(_params.title, data);
      // 完成
      resolve();
    });
  },
  // 导出 excel
  excel(params: ExcelParams) {
    return new Promise((resolve, reject) => {
      // 默认值
      const paramsDefault: ExcelParams = {
        columns: [],
        data: [],
        title: "table",
        header: null,
        merges: [],
        noHeader: false
      };
      // 合并参数
      const _params: ExcelParams = Object.assign({}, paramsDefault, params);
      // 从参数中派生数据
      const header = _params.columns.map((e) => e.label);
      const data = _params.data.map((row) => _params.columns.map((col) => row[col.prop]));

      const cols = _params.columns.map((e) => {
        const col = { ...e };
        delete col.label;
        delete col.prop;
        return col;
      });
      // 导出
      Excel.export_json_to_excel(header, data, _params.title, {
        merges: _params.merges,
        header: _params.header,
        //@ts-ignore
        cols: cols
      });
      // 完成
      resolve();
    });
  },
  // 导出 文本文档
  txt(params: TxtParams) {
    return new Promise((resolve, reject) => {
      // 默认值
      const paramsDefault: Partial<TxtParams> = {
        text: "",
        title: "文本"
      };
      // 合并参数
      const _params: TxtParams = Object.assign({}, paramsDefault, params);
      // 导出
      const blob = new Blob([_params.text], { type: "text/plain;charset=utf-8" });
      FileSaver.saveAs(blob, _params.title + ".txt");
      // 完成
      resolve();
    });
  }
};
