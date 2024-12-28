import { CrudOptions, CrudOptionsPluginHandle, RowSelectionProps, UseCrudProps } from "../d";
import { nextTick } from "vue";
import { useUi } from "@fast-crud/ui-interface";
import logger from "../utils/util.log";
import { useCompute } from "./use-compute";

export const crudOptionsPlugins: Record<string, CrudOptionsPluginHandle> = {};
export function registerCrudOptionsPlugin(name: string, plugin: CrudOptionsPluginHandle) {
  crudOptionsPlugins[name] = plugin;
}

export function getCrudOptionsPlugin(name: string): CrudOptionsPluginHandle {
  return crudOptionsPlugins[name];
}

/**
 * 行选择插件
 * @param selection
 * @param ctx
 */
registerCrudOptionsPlugin(
  "rowSelection",
  (selection: RowSelectionProps, ctx: UseCrudProps, crudOptions: any): CrudOptions => {
    const crudExpose = ctx.crudExpose;
    const crudBinding = crudExpose.crudBinding;
    function getRowKey() {
      return crudBinding.value.table.rowKey || "id";
    }
    const { ui } = useUi();
    if (!selection) {
      logger.warn("请配置settings.plugins.rowSelection.props参数");
      return;
    }
    let tableCI = ui.table;
    if (crudOptions?.table.tableVersion == "v2") {
      tableCI = ui.tableV2;
    }
    return tableCI.buildSelectionCrudOptions({
      crossPage: selection.crossPage,
      getRowKey,
      getPageData() {
        return crudBinding.value.data;
      },
      useCompute: () => {
        return useCompute();
      },
      selectionFixed: selection.selectionFixed,
      multiple: selection.multiple,
      selectedRowKeys: selection.selectedRowKeys,
      onSelectedKeysChanged: async (changed) => {
        selection.selectedRowKeys.value = [...changed];
        await nextTick();
        if (selection.onSelectedChanged) {
          selection.onSelectedChanged(selection.selectedRowKeys.value);
        }
      }
    });
  }
);
