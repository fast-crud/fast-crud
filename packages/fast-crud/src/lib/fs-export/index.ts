import _ from "lodash-es";
import { ColumnCompositionProps, ColumnProps, CrudExpose, PageQuery, UserPageQuery } from "../../d";
import { CsvParams, ExcelParams, ExportColumn, ExportUtil, ImportUtil } from "./lib/d";
import { unref } from "vue";

export async function loadFsExportUtil(): Promise<ExportUtil> {
  const module = await import.meta.glob("./lib/index.ts");
  let target: any = null;
  _.each(module, (item) => {
    target = item;
  });
  const lib = await target();
  return lib.exportUtil;
}

export async function loadFsImportUtil(): Promise<ImportUtil> {
  const module = await import.meta.glob("./lib/index.ts");
  let target: any = null;
  _.each(module, (item) => {
    target = item;
  });
  const lib = await target();
  return lib.importUtil;
}

export type DataFormatterContext = {
  row: any;
  originalRow: any;
  key: string;
  col: ColumnProps;
  exportCol: ExportColumn;
};
function defaultDataFormatter({ originalRow, row, key, col }: DataFormatterContext) {
  const value = originalRow[key];
  const dict = col.component?.dict;
  if (dict && value != null) {
    //处理dict
    const nodes = dict.getNodesFromDataMap(value);
    if (nodes != null && nodes.length > 0) {
      const label = _.map(nodes, (node) => {
        return dict.getLabel(node) || dict.getValue(node);
      }).join("|");
      if (label) {
        row[key] = label;
      }
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
  server?: (pageQuery: UserPageQuery) => Promise<void>;

  /**
   * 仅导出显示的列
   */
  onlyShow?: boolean;
  /**
   * 列过滤器
   * @param col
   */
  columnFilter?: (col: ColumnCompositionProps) => boolean;
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
   * 配置了dict的字段是否自动根据value获取label
   * 默认值：true
   */
  autoUseDictLabel?: boolean;

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
    const page = crudExpose.getPage();
    const pageQuery = crudExpose.buildPageQuery({ page });
    await opts.server(pageQuery);
    return;
  }
  const crudBinding = crudExpose.crudBinding;
  let columns: ExportColumn[] = opts.columns;
  if (columns == null) {
    columns = [];
    _.each(crudBinding.value.table.columnsMap, (col: ColumnProps) => {
      if (opts.columnFilter) {
        //列过滤器
        if (opts.columnFilter(col) === false) {
          return;
        }
      }
      // 是否仅导出显示的列
      if (opts.onlyShow && unref(col.show) === false) {
        return;
      }
      if (col.exportable !== false && col.key !== "_index") {
        const exportCol: ExportColumn = {
          key: col.key,
          title: col.title
        };
        columns.push(exportCol);
      }
    });
  }

  for (const exportCol of columns) {
    //构建列配置
    const columnProps = crudBinding.value.table.columnsMap[exportCol.key];
    exportCol.columnProps = columnProps || {};
    if (opts.columnBuilder) {
      opts.columnBuilder({ col: exportCol });
    }
  }

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
    _.each(columns, (exportCol: ExportColumn) => {
      const col = exportCol.columnProps;
      const mapping = {
        row: clone,
        originalRow: row,
        key: exportCol.key,
        col,
        exportCol
      };
      if (opts.autoUseDictLabel !== false) {
        defaultDataFormatter(mapping);
      }

      if (opts.dataFormatter) {
        opts.dataFormatter(mapping);
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
