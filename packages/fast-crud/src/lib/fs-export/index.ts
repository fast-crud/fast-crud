import _ from "lodash-es";
import { ColumnCompositionProps, ColumnProps, CrudBinding } from "/src/d";
import { ExcelParams, ExportColumn, ExportUtil, ImportUtil } from "./lib/d";
import { Ref } from "vue";

export async function loadFsExportUtil(): Promise<ExportUtil> {
  const module = await import.meta.glob("./lib/index.ts");
  console.log("module", module);
  let target: any = null;
  _.each(module, (item) => {
    target = item;
  });
  const lib = await target();
  console.log("lib", lib);
  return lib.exportUtil;
}

export async function loadFsImportUtil(): Promise<ImportUtil> {
  const module = await import.meta.glob("./lib/index.ts");
  console.log("module", module);
  let target: any = null;
  _.each(module, (item) => {
    target = item;
  });
  const lib = await target();
  console.log("lib", lib);
  return lib.importUtil;
}

export type DataFormatterContext = {
  row: any;
  originalRow: any;
  key: string;
  col: ColumnProps;
};
function defaultDataFormatter({ originalRow, row, key, col }: DataFormatterContext) {
  if (col.component?.dict && originalRow[key] != null) {
    //处理dict
    const dict = col.component.dict;
    const nodes = dict.getNodesFromDataMap(originalRow[key]);
    if (nodes != null && nodes.length > 0) {
      row[key] = _.map(nodes, (node) => {
        return dict.getLabel(node);
      }).join(",");
    }
  }
  return row;
}

/**
 * 导出配置
 */
export type ExportProps = {
  /**
   * 服务端导出，自己实现
   */
  server?: () => Promise<void>;
  /**
   * 数据mapping
   */
  dataFormatter?: (context: DataFormatterContext) => void;
  /**
   * 导出文件类型
   */
  fileType?: "csv" | "excel";
} & ExcelParams;
export async function exportTable(crudBinding: Ref<CrudBinding>, opts: ExportProps = {}): Promise<any> {
  if (opts.server) {
    await opts.server();
  }
  let columns: ExportColumn[] = opts.columns;
  if (columns == null) {
    columns = [];
    _.each(crudBinding.value.table.columnsMap, (col: ColumnCompositionProps) => {
      if (col.exportable !== false && col.key !== "_index") {
        columns.push({
          key: col.key,
          title: col.title
        });
      }
    });
  }

  //加载异步组件，不影响首页加载速度
  const exportUtil: ExportUtil = await loadFsExportUtil();
  const data = [];
  for (const row of crudBinding.value.data) {
    const clone = _.cloneDeep(row);
    _.each(crudBinding.value.table.columnsMap, (col: ColumnCompositionProps) => {
      if (col.exportable !== false && col.key !== "_index") {
        const mapping = {
          row: clone,
          originalRow: row,
          key: col.key,
          col
        };
        defaultDataFormatter(mapping);
        if (opts.dataFormatter) {
          opts.dataFormatter(mapping);
        }
      }
    });

    data.push(clone);
  }
  const expOpts = _.merge(
    {
      columns,
      data,
      filename: "table",
      noHeader: false
    },
    {
      ...opts
    }
  );
  if (opts.fileType === "excel") {
    await exportUtil.excel(expOpts);
  } else {
    await exportUtil.csv(expOpts);
  }
}

export type ImportProps = {
  file: File;
  append?: boolean;
};
export async function importTable(crudBinding: Ref<CrudBinding>, opts: ImportProps) {
  const importUtil = await loadFsImportUtil();
  const importData = await importUtil.csv(opts.file);

  if (opts.append === false) {
    crudBinding.value.data = importData.data;
  } else {
    crudBinding.value.data = crudBinding.value.data.concat(importData.data);
  }
}
