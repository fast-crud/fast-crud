import ExportCsv from "./_export-csv";
import Csv from "./_csv";
import * as Excel from "./_export2Excel";
import FileSaver from "file-saver";
import { CsvParams, ExcelParams, ExportColumn, ExportLibColumn, ExportUtil, TxtParams } from "./d";
import { importCsvFromFile } from "./_import.csv";

function transformExportColumn(columns: ExportColumn[]): ExportLibColumn[] {
  return columns.map((item) => {
    return {
      prop: item.key,
      label: item.title
    } as ExportLibColumn;
  });
}
export const exportUtil: ExportUtil = {
  // 导出 csv
  csv(params: CsvParams) {
    return new Promise((resolve, reject) => {
      // 默认值
      const paramsDefault: CsvParams = {
        columns: [],
        data: [],
        filename: "table",
        noHeader: false
      };
      // 合并参数
      const _params: CsvParams = Object.assign({}, paramsDefault, params);
      // 生成数据
      const data = Csv(transformExportColumn(_params.columns), _params.data, params, _params.noHeader);
      // 下载数据
      ExportCsv.download(_params.filename, data);
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
        filename: "table",
        header: null,
        merges: []
      };
      // 合并参数
      const _params: ExcelParams = Object.assign({}, paramsDefault, params);
      // 从参数中派生数据
      const header = _params.columns.map((e) => e.title);
      const data = _params.data.map((row) => _params.columns.map((col) => row[col.key]));

      const cols = _params.columns.map((e) => {
        const col = { ...e };
        delete col.title;
        delete col.key;
        return col;
      });
      // 导出
      Excel.export_json_to_excel(header, data, _params.filename, {
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
        filename: "文本"
      };
      // 合并参数
      const _params: TxtParams = Object.assign({}, paramsDefault, params);
      // 导出
      const blob = new Blob([_params.text], { type: "text/plain;charset=utf-8" });
      FileSaver.saveAs(blob, _params.filename + ".txt");
      // 完成
      resolve();
    });
  }
};

export const importUtil = {
  async csv(file: File) {
    return await importCsvFromFile(file);
  }
};
