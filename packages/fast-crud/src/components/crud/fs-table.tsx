import {
  computed,
  defineComponent,
  getCurrentInstance,
  PropType,
  ref,
  resolveDirective,
  resolveDynamicComponent,
  watch,
  withDirectives
} from "vue";
import { forEach, get, set } from "lodash-es";
import { useUi } from "../../ui";
import { useEditable } from "./editable/use-editable";
import logger from "../../utils/util.log";
import utilLog from "../../utils/util.log";
import "./fs-table.less";
import utils from "../../utils";
import {
  ColumnProps,
  ConditionalRenderProps,
  EditableProps,
  ScopeContext,
  TableColumnsProps,
  WriteableSlots
} from "../../d";
import { UiInterface } from "@fast-crud/ui-interface";
import { useMerge } from "../../use";
import { useComponentRefProvider } from "./use/provider";

type BuildTableColumnsOption = {
  props: any;
  ui: UiInterface;
  sortedColumns: TableColumnsProps;
  renderRowHandle: any;
  renderCellComponent: any;
};
function buildTableSlots({ props, ui, sortedColumns, renderRowHandle, renderCellComponent }: BuildTableColumnsOption) {
  const tableComp = resolveDynamicComponent(ui.table.name);
  const tableColumnComp = resolveDynamicComponent(ui.tableColumn.name);
  const tableColumnGroupComp = resolveDynamicComponent(ui.tableColumnGroup.name);
  const tableColumnCI = ui.tableColumn;
  const tableSlots: WriteableSlots = {};

  const buildColumn = (item: ColumnProps): any => {
    const cellSlots: WriteableSlots = {
      ...item.columnSlots
    };
    const cellSlotName = "cell_" + item.key;
    let currentTableColumnComp = tableColumnComp;
    if (item.children) {
      //subColumns
      cellSlots.default = () => {
        const subColumns: any[] = [];
        forEach(item.children, (subColumn) => {
          if (subColumn.show === false) {
            return;
          }
          subColumns.push(buildColumn(subColumn));
        });
        return subColumns;
      };
      currentTableColumnComp = tableColumnGroupComp;
    } else if (item.type != null) {
      //cell render by type
      logger.debug("cell render column.type:", item.type);
      const slots = props.cellSlots && props.cellSlots[cellSlotName];
      if (slots) {
        cellSlots.default = slots;
      }
    } else {
      // cell render custom component
      cellSlots.default = (scope: any) => {
        return renderCellComponent(item, scope) as any;
      };
    }
    const newItem = { ...item };
    delete newItem.children;

    return (
      <currentTableColumnComp
        ref={"tableColumnRef"}
        {...newItem}
        label={item.title}
        prop={item.key}
        dataIndex={item.key}
        v-slots={cellSlots}
      />
    );
  };

  tableSlots.default = () => {
    const children = [];

    forEach(sortedColumns, (item) => {
      if (item.show === false) {
        return;
      }
      children.push(buildColumn(item));
    });

    // rowHandle
    if (props.rowHandle && props.rowHandle.show !== false) {
      const rowHandleSlots = {
        default: renderRowHandle
      };
      children.push(
        <tableColumnComp
          ref={"tableColumnRef"}
          {...props.rowHandle}
          label={props.rowHandle.title}
          prop={props.rowHandle.key || "rowHandle"}
          v-slots={rowHandleSlots}
        />
      );
    }
    return children;
  };

  if (props.slots) {
    forEach(props.slots, (item, key) => {
      tableSlots[key] = item;
    });
  }

  return tableSlots;
}

/**
 * 通过config来渲染列
 * @param props
 * @param componentRefs
 * @param renderRowHandle
 * @returns {*[]}
 */
function buildTableColumns(options: any, parent?: any): any[] {
  const { props, renderRowHandle, renderCellComponent, sortedColumns } = options;
  const { ui } = useUi();
  const originalColumns = sortedColumns ?? {};
  const columns: ColumnProps[] = [];

  let tableCI = ui.table;
  if (props.tableVersion === "v2") {
    tableCI = ui.tableV2;
  }
  for (const key in originalColumns) {
    const column = originalColumns[key];
    if (column.show === false) {
      continue;
    }
    const item = { ...column };
    item._parent = parent;
    item.dataIndex = column.key;
    columns.push(item);

    const hasChildren = column.children != null;
    if (hasChildren) {
      // 表头分组
      const childOptions = { ...options, sortedColumns: column.children };
      delete childOptions.renderRowHandle;
      item.children = buildTableColumns(childOptions, item);
    } else if (column.type != null) {
      // 特定列 selection 和 expand
    } else {
      //渲染组件
      const customRender = item[tableCI.renderMethod];
      const newCol = { ...item };
      delete newCol[tableCI.renderMethod];
      if (!customRender) {
        //如果没有配置customRender 默认使用render cell component
        item[tableCI.renderMethod] = (a: any, b: any, c: any) => {
          const scope = tableCI.rebuildRenderScope(a, b, c);
          return renderCellComponent(newCol, scope);
        };
      } else {
        //配置了customRender,先走customRender，在内部让用户根据情况调用cellRender
        item[tableCI.renderMethod] = (a: any, b: any, c: any) => {
          const scope = tableCI.rebuildRenderScope(a, b, c);
          const cellRender = () => {
            return renderCellComponent(newCol, scope);
          };
          return customRender(scope, cellRender);
        };
      }
    }
  }

  if (renderRowHandle && props.rowHandle?.show !== false) {
    //操作列
    const rowHandle = {
      key: "_rowHandle",
      ...props.rowHandle
    };
    rowHandle[tableCI.renderMethod] = (a: any, b: any, c: any) => {
      const scope = tableCI.rebuildRenderScope(a, b, c);
      return renderRowHandle(scope);
    };
    columns.push(rowHandle);
  }

  utilLog.debug("table columns:", columns);

  return columns;
}

/**
 * fs-table,表格封装
 * 支持el-table/a-table的参数
 */
export default defineComponent({
  name: "FsTable",
  inheritAttrs: false,
  props: {
    tableVersion: {
      type: String as PropType<string>
    },
    /**
     * table插槽
     */
    slots: {
      type: Object as PropType<any>
    },
    /**
     * 单元格插槽
     */
    cellSlots: {
      type: Object as PropType<any>
    },
    /**
     * 列配置，支持el-table-column|a-table-column配置
     */
    columns: {
      type: Object as PropType<TableColumnsProps>,
      default: undefined
    },
    /**
     * 操作列
     */
    rowHandle: {
      type: Object as PropType<any>
    },
    /**
     * 是否显示表格
     */
    show: {
      type: Boolean,
      default: true
    },
    /**
     * 表格数据
     */
    data: {
      type: Array,
      default: () => {
        return [];
      }
    },

    conditionalRender: {
      type: Object as PropType<ConditionalRenderProps>
    },

    /**
     * 行编辑，批量编辑
     */
    editable: {
      type: Object as PropType<EditableProps>,
      default() {
        return {};
      }
    },

    loading: {
      type: Boolean,
      default: false
    },
    /**
     * 当前sort状态
     */
    sort: {
      type: Object as PropType<any>
    },
    request: {
      type: Object as PropType<any>
    },
    rowKey: {
      type: [String, Function],
      default: "id"
    }
  },
  emits: ["row-handle", "value-change", "pagination-change", "filter-change", "sort-change", "data-change"],
  setup(props: any, ctx) {
    utils.trace("fs-table");
    const tableRef = ref();
    const componentRefs = ref([]);
    useComponentRefProvider(componentRefs);
    const getComponentRef = (index?: number, key?: string) => {
      if (!key || index == null || index > componentRefs.value.length) {
        return;
      }
      const row = componentRefs.value[index];
      const cellRef = row[key];
      return cellRef?.getTargetRef();
    };

    const { ui } = useUi();

    const currentRef = getCurrentInstance();
    watch(
      () => {
        return props.data;
      },
      (value) => {
        ctx.emit("data-change", { data: value });
      }
    );

    let tableCI = ui.table;
    let tableColumnCI = ui.tableColumn;
    if (props.tableVersion === "v2") {
      tableCI = ui.tableV2;
      tableColumnCI = ui.tableColumnV2;
    }

    function scrollTo(top: number = 0) {
      tableCI.scrollTo({
        top,
        tableRef,
        fsTableRef: currentRef
      });
    }

    const tableComp = resolveDynamicComponent(tableCI.name);

    const editableWrap = useEditable(props, ctx, tableRef);

    const getContextFn = (item: any, scope: any): ScopeContext => {
      const row = scope[tableColumnCI.row];
      const form = row;
      const index = scope[tableColumnCI.index];
      scope.index = index;
      return {
        ...scope,
        key: item.key,
        value: get(row, item.key),
        row,
        form,
        getComponentRef: (key: string) => {
          return getComponentRef(index, key);
        }
      };
    };

    function onRowHandle(context: ScopeContext) {
      ctx.emit("row-handle", context);
    }

    const events = tableCI.onChange({
      onSortChange: (sorter) => {
        ctx.emit("sort-change", sorter);
      },
      onFilterChange: (filters: any) => {
        ctx.emit("filter-change", filters);
      },
      onPagination: () => {
        //
      },
      bubbleUp: (onChange) => {
        onChange(ctx.attrs);
      }
    });

    const renderRowHandle = (scope: any) => {
      // @ts-ignore
      scope.index = scope[tableColumnCI.index];
      const rowHandleSlotsName = "cell-rowHandle";
      const rowHandleSlots: any = {};
      if (props.cellSlots) {
        for (const key in props.cellSlots) {
          if (key.startsWith(rowHandleSlotsName)) {
            rowHandleSlots[key] = props.cellSlots[key];
          }
        }
      }
      return <fs-row-handle {...props.rowHandle} scope={scope} onHandle={onRowHandle} v-slots={rowHandleSlots} />;
    };

    const renderCellComponent = (item: any, scope: any) => {
      const cellSlotName = "cell_" + item.key;
      const row = (scope.row = scope[tableColumnCI.row]);
      // const getScopeFn = () => {
      //   return getContextFn(item, scope);
      // };
      const vModel = {
        modelValue: get(scope[tableColumnCI.row], item.key),
        "onUpdate:modelValue": (value: any) => {
          set(scope[tableColumnCI.row], item.key, value);
          const newScope = getContextFn(item, scope);
          ctx.emit("value-change", newScope);
          if (item.valueChange) {
            if (item.valueChange instanceof Function) {
              item.valueChange(newScope);
            } else {
              item.valueChange?.handle(newScope);
            }
          }
        }
      };
      const setRef = (el: any) => {
        const index = scope[tableColumnCI.index];
        const key = item.key;
        let rowRefs = componentRefs.value[index];
        if (rowRefs == null) {
          componentRefs.value[index] = rowRefs = {};
        }
        rowRefs[key] = el;
      };

      const index = scope[tableColumnCI.index];
      const editableId = row[props.editable?.rowKey];

      const cellSlots = props.cellSlots && props.cellSlots[cellSlotName];

      const newScope = getContextFn(item, scope);
      if (editableWrap.editable?.options?.value?.enabled === true) {
        // if (props.editableCell && props.editableCell?.options?.value?.enabled === true) {
        const editableCell = editableWrap.editable.getEditableCell(editableId, item.key);
        return (
          <fs-editable-cell
            ref={setRef}
            key={item.key}
            columnKey={item.key}
            index={index}
            editableId={editableId}
            item={item}
            editableCell={editableCell}
            editableOpts={editableWrap.editable?.options?.value}
            scope={newScope}
            slots={cellSlots}
            disabled={editableWrap.editable?.options?.value?.disabled}
            readonly={editableWrap.editable?.options?.value?.readonly}
            {...vModel}
          />
        );
      } else {
        return (
          <fs-cell
            ref={setRef}
            key={item.key}
            item={item}
            scope={newScope}
            slots={cellSlots}
            {...vModel}
            conditionalRender={props.conditionalRender}
          />
        );
      }
    };

    const { expose } = ctx;

    expose({
      tableRef,
      componentRefs,
      getComponentRef,
      ...editableWrap,
      scrollTo
    });

    const renderMode = tableCI.renderMode;
    const dataSource = computed(() => {
      return {
        [tableCI.data]: props.data
      };
    });

    const { merge } = useMerge();
    const computedBinding = computed(() => {
      return merge({}, ctx.attrs, events);
    });
    const sortedColumns = computed(() => {
      // 已经在useColumns中排序过了
      return props.columns;
    });
    if (renderMode === "slot") {
      //使用slot column ，element-plus
      const computedTableSlots = computed(() => {
        return buildTableSlots({
          props,
          ui,
          sortedColumns: sortedColumns.value,
          renderRowHandle,
          renderCellComponent
        } as BuildTableColumnsOption);
      });

      return () => {
        if (props.show === false) {
          return;
        }

        const tableRender = (
          <tableComp
            ref={tableRef}
            loading={props.loading}
            rowKey={props.rowKey}
            {...computedBinding.value}
            {...dataSource.value}
            v-slots={computedTableSlots.value}
          />
        );
        if (typeof tableCI.vLoading === "string") {
          const loading = resolveDirective(tableCI.vLoading);
          return withDirectives(tableRender, [[loading, props.loading]]);
        }
        return tableRender;
      };
    } else {
      //使用 jsx column
      const computedColumns = computed(() => {
        return buildTableColumns({
          props,
          ctx,
          ui,
          getContextFn,
          sortedColumns: sortedColumns.value,
          componentRefs,
          renderRowHandle,
          renderCellComponent,
          columns: props.columns
        });
      });

      const computedFlatColumns = computed(() => {
        const flatColumns = [];
        function flatColumnsFn(columns: any[]) {
          columns.forEach((column) => {
            if (column.children) {
              flatColumnsFn(column.children);
            } else {
              flatColumns.push(column);
            }
          });
        }
        flatColumnsFn(computedColumns.value);
        // console.log("flatColumns", flatColumns);
        return flatColumns;
      });

      const computedMultiHeaders = computed(() => {
        if (tableCI.buildMultiHeadersBind) {
          return tableCI.buildMultiHeadersBind({
            treeColumns: computedColumns.value,
            flatColumns: computedFlatColumns.value
          });
        }
        return {
          bind: {},
          slots: {}
        };
      });

      return () => {
        if (props.show === false) {
          return;
        }
        const slots = {
          ...props.slots,
          ...computedMultiHeaders.value?.slots
        };

        const isFlat = tableCI.columnsIsFlat;

        const createTableInstance = (bind: any = {}) => {
          return (
            <tableComp
              ref={tableRef}
              loading={props.loading}
              rowKey={props.rowKey}
              {...computedBinding.value}
              columns={isFlat ? computedFlatColumns.value : computedColumns.value}
              {...dataSource.value}
              {...computedMultiHeaders.value?.bind}
              {...bind}
              v-slots={slots}
            />
          );
        };
        if (props.tableVersion === "v2" && ui.type === "element") {
          //element 需要wrapper
          const slots = {
            default({ width, height }: any) {
              return createTableInstance({
                width,
                height
              });
            }
          };
          return <el-auto-resizer v-slots={slots}></el-auto-resizer>;
        }
        return createTableInstance();
      };
    }
  }
});
