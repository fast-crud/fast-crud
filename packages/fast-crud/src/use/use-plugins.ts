import { CrudOptions, CrudOptionsPluginHandle, MobileAdaptorProps, RowSelectionProps, UseCrudProps } from "../d";
import { computed, nextTick } from "vue";
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
        const selectedRowKeys =
          selection.selectedRowKeys instanceof Function ? selection.selectedRowKeys() : selection.selectedRowKeys;
        selectedRowKeys.value = [...changed];
        await nextTick();
        if (selection.onSelectedChanged) {
          selection.onSelectedChanged(selectedRowKeys.value);
        }
      }
    });
  }
);

/**
 * 手机版
 */
registerCrudOptionsPlugin(
  "mobile",
  (mobileAdaptor: MobileAdaptorProps, ctx: UseCrudProps, crudOptions: any): CrudOptions => {
    const rowHandle = crudOptions.rowHandle;
    const buttons = rowHandle.buttons;
    const newButtons = {};
    for (const buttonsKey in buttons) {
      const button = buttons[buttonsKey];
      button.dropdown;
      newButtons[buttonsKey] = {
        ...button,
        dropdown: computed(() => {
          return mobileAdaptor.isMobile.value ? true : button.dropdown;
        })
      };
    }
    return {
      rowHandle: {
        width: computed(() => {
          if (mobileAdaptor.isMobile.value) {
            return mobileAdaptor?.rowHandle?.width || 60;
          }
          return rowHandle.width || 120;
        }),
        buttons: newButtons
      }
    };
  }
);
