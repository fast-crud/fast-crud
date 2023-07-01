import _ from "lodash-es";
import { ColumnCompositionProps, CrudBinding } from "/src/d";
import { ExcelParams, ExportColumn, ExportUtil } from "./lib/d";
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
   * @param row
   */
  dataMapping?: (row: any) => any;
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
  const dataMapping = opts.dataMapping || ((row) => row);
  for (const row of crudBinding.value.data) {
    data.push(dataMapping(row));
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
