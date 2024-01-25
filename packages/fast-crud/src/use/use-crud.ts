import defaultCrudOptions from "./default-crud-options";
import _ from "lodash-es";
import { useMerge } from "./use-merge";
import logger from "../utils/util.log";
import { uiContext } from "../ui";
import { useI18n } from "../locale";
import {
  ColumnCompositionProps,
  ColumnProps,
  ComputeContext,
  CreateCrudOptionsRet,
  CrudBinding,
  CrudExpose,
  CrudOptionsPluginHandle,
  CrudOptionsPlugins,
  CrudSettings,
  DynamicallyCrudOptions,
  EditableRow,
  ScopeContext,
  TableColumnsProps,
  UseCrudProps,
  UseCrudRet,
  UseFsProps,
  UseFsRet
} from "../d";
import { useCompute } from "./use-compute";
import { buildTableColumnsFlatMap, forEachTableColumns, useColumns } from "./use-columns";
import { CrudOptions } from "../d/crud";
import { computed, Ref, ref, unref } from "vue";
import { useExpose } from "./use-expose";
import { exportTable } from "../lib/fs-export";
import { getCrudOptionsPlugin } from "../use/use-plugins";

const { merge } = useMerge();

// 导出useCrud
export function useCrud(ctx: UseCrudProps): UseCrudRet {
  if (ctx.context == null) {
    ctx.context = {};
  }
  const ui = uiContext.get();
  const { t } = useI18n();
  const computedT = (name: string) => {
    return computed(() => {
      return t(name);
    });
  };

  let options: CrudOptions = ctx.crudOptions as CrudOptions;
  const crudExpose = ctx.expose || ctx.crudExpose;
  if (!crudExpose) {
    throw new Error("crudExpose不能为空，请给useCrud传入{crudExpose}参数");
  }
  const expose: CrudExpose = crudExpose;

  const { crudBinding } = expose;

  const { doRefresh, doValueResolve } = expose;

  function usePagination() {
    const events = ui.pagination.onChange({
      setCurrentPage(current: number) {
        crudBinding.value.pagination[ui.pagination.currentPage] = current;
      },
      setPageSize(pageSize: number) {
        crudBinding.value.pagination.pageSize = pageSize;
        crudBinding.value.pagination[ui.pagination.currentPage] = 1; //重置页码到1
      },
      async doAfterChange() {
        return await doRefresh();
      }
    });
    return {
      pagination: {
        ...events
      }
    };
  }

  function useFormSubmit() {
    return {
      form: {
        async doSubmit(context: ScopeContext) {
          if (context.mode === "edit") {
            doValueResolve(context);
            if (options.mode?.name === "local") {
              expose.updateTableRow(context.index, context.form, options.mode.isMergeWhenUpdate);
            } else {
              if (!crudBinding.value.request?.editRequest) {
                logger.warn("request.editRequest 未定义，无法保存");
              }
              return await crudBinding.value.request.editRequest(context);
            }
          } else if (context.mode === "add") {
            doValueResolve(context);
            if (options.mode?.name === "local") {
              const index = options.mode.isAppendWhenAdd ? expose.getTableData().length : 0;
              expose.insertTableRow(index, context.form);
            } else {
              if (!crudBinding.value.request?.addRequest) {
                logger.warn("request.addRequest 未定义，无法保存");
              }
              return await crudBinding.value.request.addRequest(context);
            }
          }
        },
        async onSuccess() {
          doRefresh();
        }
      }
    };
  }

  function useRowHandle() {
    return {
      rowHandle: {
        buttons: {
          remove: {
            click: async (context: ScopeContext) => {
              // @ts-ignore
              context.row = context[ui.tableColumn.row];
              await expose.doRemove(context);
            }
          },
          edit: {
            click: async (context: ScopeContext) => {
              // @ts-ignore
              context.row = context[ui.tableColumn.row];
              await expose.openEdit({
                row: context.row,
                index: context.index
              });
            }
          },
          view: {
            click: async (context: ScopeContext) => {
              // @ts-ignore
              context.row = context[ui.tableColumn.row];
              await expose.openView({
                row: context.row,
                index: context.index
              });
            }
          }
        }
      }
    };
  }

  function useSearch() {
    return {
      search: {
        buttons: {
          search: {
            loading: computed(() => {
              return crudBinding.value?.table?.loading;
            })
          }
        },
        on_reset() {
          crudBinding.value.table.sort = {};
          forEachTableColumns(crudBinding.value.table.columns, (column: ColumnCompositionProps) => {
            //清空sort
            column.sortOrder = false;
          });
          //element 清空sort
          const baseTableRef = crudExpose.getBaseTableRef();
          if (baseTableRef?.clearSort) {
            baseTableRef.clearSort();
          }
        },
        onSearch() {
          crudExpose.doRefresh({ goFirstPage: true });
        },
        ["onUpdate:form"]: (value: any) => {
          crudBinding.value.search.form = value;
        },
        ["onUpdate:validatedForm"]: (value: any) => {
          crudBinding.value.search.validatedForm = value;
        },
        ["onUpdate:collapse"]: (value: any) => {
          crudBinding.value.search.collapse = value;
        },
        container: {
          collapse: true,
          ["onUpdate:collapse"]: (value: any) => {
            crudBinding.value.search.container.collapse = value;
          }
        }
      }
    };
  }

  function useTabs() {
    return {
      tabs: {},
      onTabChange(formData: any) {
        crudExpose.setSearchFormData({ form: formData });
        doRefresh();
      }
    };
  }

  function useToolbar() {
    const exporting = ref(false);
    return {
      toolbar: {
        buttons: {
          refresh: {
            type: "primary",
            icon: ui.icons.refresh,
            title: computedT("fs.toolbar.refresh.title"), // '刷新',
            order: 1,
            circle: true,
            click: async () => {
              await crudExpose.doRefresh();
            }
          },
          search: {
            type: computed(() => {
              return crudBinding.value.search.show !== false ? "primary" : "default";
            }),
            icon: ui.icons.search,
            title: computedT("fs.toolbar.search.title"), // '查询显示',
            order: 2,
            circle: true,
            click: () => {
              crudBinding.value.search.show = !crudBinding.value.search.show;
            }
          },
          compact: {
            type: computed(() => {
              return crudBinding.value.toolbar.compact ? "primary" : "default";
            }),
            icon: ui.icons.compact,
            title: computedT("fs.toolbar.compact.title"), // '紧凑模式',
            order: 3,
            circle: true,
            click: () => {
              crudBinding.value.toolbar.compact = !crudBinding.value.toolbar.compact;
            }
          },
          export: {
            show: true,
            type: "primary",
            icon: ui.icons.export,
            order: 4,
            loading: exporting,
            title: computedT("fs.toolbar.export.title"), // '导出',
            circle: true,
            click: async () => {
              exporting.value = true;
              try {
                await exportTable(crudExpose, crudBinding.value.toolbar.export);
              } finally {
                exporting.value = false;
              }
            }
          },
          columns: {
            type: "primary",
            icon: ui.icons.columnsFilter,
            title: computedT("fs.toolbar.columns.title"), // '列设置',
            circle: true,
            order: 5
          }
        },
        "onUpdate:columns"(value: TableColumnsProps) {
          const original = crudBinding.value.table.columns;
          const columns: TableColumnsProps = {};
          _.forEach(value, (item) => {
            for (const key in original) {
              const column = original[key];
              if (column.key === item.key) {
                delete column.order;
                merge(column, item);
                columns[key] = column;
                return;
              }
            }
          });

          crudBinding.value.table.columns = columns;
          crudBinding.value.table.columnsMap = buildTableColumnsFlatMap({}, columns);
        }
      }
    };
  }

  function useTable() {
    return {
      table: {
        onSortChange(sortChange: { isServerSort: boolean; prop: any; asc: any; order: any }) {
          const { isServerSort, prop, asc, order } = sortChange;

          forEachTableColumns(crudBinding.value.table.columns, (column: ColumnProps) => {
            if (column.key === prop) {
              column.sortOrder = order;
            } else {
              column.sortOrder = false;
            }
          });

          const oldSort = crudBinding.value.table.sort;
          crudBinding.value.table.sort = isServerSort ? { prop, order, asc } : null;
          if (isServerSort || oldSort != null) {
            expose.doRefresh();
          }
        }
      }
    };
  }

  function useActionbar() {
    return {
      actionbar: {
        buttons: {
          add: {
            click() {
              expose.openAdd({});
            }
          }
        }
      }
    };
  }

  function useEditable() {
    const { compute } = useCompute();

    return {
      actionbar: {
        buttons: {
          addRow: {
            show: false, //默认不启用
            text: computedT("fs.actionbar.add"),
            type: "primary",
            click: () => {
              expose.editable.addRow();
            }
          }
        }
      },
      rowHandle: {
        group: {
          editable: {
            remove: {
              text: "删除",
              ...ui.button.colors("danger"),
              click: async (context: ScopeContext) => {
                const { index, row } = context;
                const editableId = row[crudBinding.value.table.editable.rowKey];
                await expose.editable.doRemoveRow({ editableId, row });
              }
            }
          },
          editRow: {
            edit: {
              text: "编辑",
              loading: compute((context: ComputeContext) => {
                const { index, row } = context;
                const editableId = row[crudBinding.value.table.editable.rowKey];
                const editableRow = expose.editable.getEditableRow(editableId);
                return !!editableRow?.loading;
              }),
              click: async (context: ScopeContext) => {
                const { index, row } = context;
                const editableId = row[crudBinding.value.table.editable.rowKey];
                if (crudBinding.value.table.editable.exclusive) {
                  //排他式激活
                  const activeRows: EditableRow[] = expose.editable.getActiveRows();
                  _.forEach(activeRows, (item: EditableRow) => {
                    if (crudBinding.value.table.editable.exclusiveEffect === "save") {
                      expose.editable.doSaveRow({ row: item.rowData });
                    } else {
                      expose.editable.doCancelRow({ row: item.rowData });
                    }
                  });
                }
                expose.editable.getEditableRow(editableId)?.active();
              },
              show: compute((context: ComputeContext) => {
                const { index, row } = context;
                const editableId = row[crudBinding.value.table.editable.rowKey];
                return !expose.editable?.getEditableRow(editableId)?.isEditing;
              })
            },
            save: {
              text: "保存",
              loading: false,
              click: async (context: ScopeContext) => {
                const { index, row } = context;
                await expose.editable.doSaveRow({ row });
              },
              show: compute((context: ComputeContext) => {
                const { index, row } = context;
                const editableId = row[crudBinding.value.table.editable.rowKey];
                return !!expose.editable?.getEditableRow(editableId)?.isEditing;
              })
            },
            cancel: {
              text: "取消",
              click: async (context: ScopeContext) => {
                const { index, row } = context;
                await expose.editable?.doCancelRow({ row });
              },
              show: compute((context: ComputeContext) => {
                const { index, row } = context;
                const editableId = row[crudBinding.value.table.editable.rowKey];
                return !!expose.editable?.getEditableRow(editableId)?.isEditing;
              })
            },
            remove: {
              text: "删除",
              ...ui.button.colors("danger"),
              click: async (context: ScopeContext) => {
                const { index, row } = context;
                await expose.editable?.doRemoveRow({ row });
              }
            }
          }
        }
      }
    };
  }

  function afterUseCrud(bindings: CrudBinding) {
    bindings.search.validatedForm = _.cloneDeep(bindings.search.initialForm);
  }

  function rebuildCrudBindings(options: DynamicallyCrudOptions) {
    options = merge(defaultCrudOptions.commonOptions(ctx), options);
    const settings: CrudSettings = unref(options.settings) as CrudSettings;
    if (settings) {
      const plugins = unref(settings.plugins) as CrudOptionsPlugins;
      _.forEach(plugins, (plugin, key) => {
        if (plugin.enabled === false) {
          return;
        }
        let handle: CrudOptionsPluginHandle = plugin.handle;
        if (handle == null) {
          handle = getCrudOptionsPlugin(key);
        }
        if (handle == null) {
          return;
        }
        const before = plugin.before;
        const pluginOptions = handle(plugin.props, ctx);
        if (before !== false) {
          options = merge(pluginOptions, options);
        } else {
          merge(options, pluginOptions);
        }
      });
    }

    const userOptions = merge(
      defaultCrudOptions.defaultOptions({ t, ct: computedT }),
      usePagination(),
      useFormSubmit(),
      useRowHandle(),
      useSearch(),
      useTabs(),
      useToolbar(),
      useTable(),
      useActionbar(),
      useEditable(),
      options
    );

    const { buildColumns } = useColumns();
    //初始化columns，将crudOptions.columns里面的配置转化为crudBinding
    const bindings = buildColumns(userOptions);
    afterUseCrud(bindings);
    return bindings;
  }

  function resetCrudOptions(options: DynamicallyCrudOptions) {
    // 设置crudOptions Ref
    crudBinding.value = rebuildCrudBindings(options);
    logger.info("fast-crud inited, crudBinding=", crudBinding.value);
  }

  function appendCrudOptions(overOptions: DynamicallyCrudOptions): DynamicallyCrudOptions {
    const newOptions = merge({}, options, overOptions);
    resetCrudOptions(newOptions);
    options = newOptions;
    return newOptions;
  }

  resetCrudOptions(options);

  /**
   * 追加配置,注意是覆盖crudBinding的结构，而不是crudOptions的结构
   * @param overOptions
   */
  function appendCrudBinding(overOptions: CrudBinding) {
    merge(crudBinding.value, overOptions);
  }

  return {
    appendCrudOptions,
    resetCrudOptions,
    appendCrudBinding
  };
}

function useFsImpl(props: UseFsProps): UseFsRet | Promise<UseCrudRet> {
  const { createCrudOptions, crudExposeRef } = props;
  const crudRef = props.crudRef || ref();
  // crud 配置的ref
  const crudBinding: Ref<CrudBinding> = props.crudBinding || ref({});
  // 暴露的方法
  const { crudExpose } = useExpose({ crudRef, crudBinding });

  if (crudExposeRef && !crudExposeRef.value) {
    crudExposeRef.value = crudExpose;
  }

  if (props.context == null) {
    props.context = {};
  }
  const context = props.context;
  if (props.onExpose) {
    props.onExpose({ crudRef, crudBinding, crudExpose, context });
  }
  // 你的crud配置
  const createCrudOptionsRet = createCrudOptions({
    ...props,
    crudExpose,
    expose: crudExpose,
    context
  });

  function initCrud(createCrudOptionsRet: CreateCrudOptionsRet) {
    const useCrudProps: UseCrudProps = { crudExpose, ...createCrudOptionsRet, context };

    merge(createCrudOptionsRet.crudOptions, props.crudOptionsOverride);

    const useCrudRet = useCrud(useCrudProps);
    return {
      ...createCrudOptionsRet,
      ...useCrudRet,
      crudRef,
      crudExpose,
      crudBinding,
      context
    };
  }

  if (createCrudOptionsRet instanceof Promise) {
    return createCrudOptionsRet.then((ret) => {
      return initCrud(ret);
    });
  } else {
    // 初始化crud配置
    return initCrud(createCrudOptionsRet);
  }
}

export function useFs(props: UseFsProps): UseFsRet {
  return useFsImpl(props) as UseFsRet;
}

export function useFsAsync(props: UseFsProps): Promise<UseFsRet> {
  return useFsImpl(props) as Promise<UseFsRet>;
}
