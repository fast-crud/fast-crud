import {
  CrudOptions,
  CrudOptionsPluginHandle,
  CrudOptionsPluginOpts,
  CrudOptionsPluginReg,
  MobileAdaptorProps,
  RowSelectionProps,
  UseCrudProps
} from "../d";
import { computed, isRef, nextTick } from "vue";
import { useUi } from "@fast-crud/ui-interface";
import logger from "../utils/util.log";
import { useCompute } from "./use-compute";
export const crudOptionsPlugins: Record<string, CrudOptionsPluginReg> = {};
export function registerCrudOptionsPlugin(
  name: string,
  plugin: CrudOptionsPluginHandle,
  opts: CrudOptionsPluginOpts = {}
) {
  crudOptionsPlugins[name] = {
    handle: plugin,
    opts
  };
}

export function getCrudOptionsPlugin(name: string): CrudOptionsPluginReg {
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
  },
  {
    before: true,
    order: -2
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
    let newButtons = {};
    for (const buttonsKey in buttons) {
      const button = buttons[buttonsKey];
      if (isRef(button.dropdown)) {
        newButtons = button;
      } else {
        newButtons[buttonsKey] = {
          ...button,
          dropdown: computed(() => {
            return mobileAdaptor.isMobile.value ? true : button.dropdown;
          })
        };
      }
    }

    let widthRef = rowHandle.width;
    if (widthRef == null || !isRef(widthRef)) {
      widthRef = computed(() => {
        if (mobileAdaptor.isMobile.value) {
          return mobileAdaptor?.rowHandle?.width || 60;
        }
        return rowHandle.width || 250;
      });
    }
    return {
      rowHandle: {
        width: widthRef,
        buttons: newButtons
      }
    };
  },
  {
    before: false,
    order: -2
  }
);
