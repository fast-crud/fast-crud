import _ from "lodash-es";
import { ColumnCompositionProps, ColumnProps, CrudExpose, PageQuery } from "../../d";
import { CsvParams, ExcelParams, ExportColumn, ExportUtil, ImportUtil } from "./lib/d";

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
      }).join("|");
    }
  }
  return row;
}

export type ColumnBuilderContext = {
  col: ExportColumn;
};
/**
 * 导出配置
 */
export type ExportProps = {
  /**
   * 服务端导出，自己实现
   */
  server?: () => Promise<void>;

  /**
   * 列配置构建器
   */
  columnBuilder?: (context: ColumnBuilderContext) => void;
  /**
   * 数据mapping
   */
  dataFormatter?: (context: DataFormatterContext) => void;
  /**
   * 导出文件类型
   */
  fileType?: "csv" | "excel";

  /**
   * 数据来源
   * local: 本地当前页数据（默认）
   * search: 搜索数据
   */
  dataFrom?: "local" | "search";

  /**
   * 查询参数
   */
  searchParams?: PageQuery;

  /**
   * 数据分隔符
   */
  separator?: string; // 数据分隔符
  /**
   * 数据是否加引号
   */
  quoted?: boolean; //每项数据是否加引号
} & CsvParams &
  ExcelParams;
export async function exportTable(crudExpose: CrudExpose, opts: ExportProps = {}): Promise<any> {
  if (opts.server) {
    await opts.server();
  }
  const crudBinding = crudExpose.crudBinding;
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
  columns.forEach((col) => {
    if (opts.columnBuilder) {
      opts.columnBuilder({ col });
    }
  });

  //加载异步组件，不影响首页加载速度
  const exportUtil: ExportUtil = await loadFsExportUtil();
  const data = [];
  let originalData = crudBinding.value.data;
  if (opts.dataFrom === "search") {
    const searchParams = _.merge(
      {
        page: {
          currentPage: 1,
          pageSize: 99999999
        }
      },
      crudBinding.value.toolbar.export.searchParams
    );
    const pageRes = await crudExpose.search(searchParams, { silence: true });
    originalData = pageRes.records;
  }
  for (const row of originalData) {
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
      noHeader: false,
      separator: ",", // 数据分隔符
      quoted: false //每项数据是否加引号
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
export async function importTable(crudExpose: CrudExpose, opts: ImportProps) {
  const importUtil = await loadFsImportUtil();
  const importData = await importUtil.csv(opts.file);
  const crudBinding = crudExpose.crudBinding;
  if (opts.append === false) {
    crudBinding.value.data.length = 0;
  }
  const isEditable = crudBinding.value.table.editable.enabled;
  for (const row of importData.data) {
    if (isEditable) {
      crudExpose.editable.addRow({ row, active: false });
    } else {
      crudBinding.value.data.push(row);
    }
  }
}
