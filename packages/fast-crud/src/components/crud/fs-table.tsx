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
import _ from "lodash-es";
import { useUi } from "../../ui";
import { useEditable } from "./editable/use-editable";
import logger from "../../utils/util.log";
import utilLog from "../../utils/util.log";
import "./fs-table.less";
import {
  ColumnProps,
  ConditionalRenderProps,
  EditableProps,
  ScopeContext,
  TableColumnsProps,
  WriteableSlots
} from "../../d";
import { UiInterface } from "@fast-crud/ui-interface";

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
  tableSlots.default = () => {
    const children = [];
    const buildColumn = (item: ColumnProps): any => {
      const cellSlots: WriteableSlots = {};
      const cellSlotName = "cell_" + item.key;
      let currentTableColumnComp = tableColumnComp;
      if (item.children) {
        //subColumns
        cellSlots.default = () => {
          const subColumns: any[] = [];
          _.forEach(item.children, (subColumn) => {
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
    _.forEach(sortedColumns, (item) => {
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
    _.forEach(props.slots, (item, key) => {
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
function buildTableColumns(options: any): any[] {
  const { props, renderRowHandle, renderCellComponent, sortedColumns } = options;
  const { ui } = useUi();
  const originalColumns = sortedColumns ?? {};
  const columns: ColumnProps[] = [];

  for (const key in originalColumns) {
    const column = originalColumns[key];
    if (column.show === false) {
      continue;
    }
    const item = { ...column };
    item.dataIndex = column.key;
    columns.push(item);
    if (column.children != null) {
      // 表头分组
      const childOptions = { ...options, sortedColumns: column.children };
      delete childOptions.renderRowHandle;
      item.children = buildTableColumns(childOptions);
    } else if (column.type != null) {
      // 特定列 selection 和 expand
    } else {
      //渲染组件
      const customRender = item[ui.table.renderMethod];
      const newCol = { ...item };
      delete newCol[ui.table.renderMethod];
      if (!customRender) {
        //如果没有配置customRender 默认使用render cell component
        item[ui.table.renderMethod] = (a: any, b: any, c: any) => {
          const scope = ui.table.rebuildRenderScope(a, b, c);
          return renderCellComponent(newCol, scope);
        };
      } else {
        //配置了customRender,先走customRender，在内部让用户根据情况调用cellRender
        item[ui.table.renderMethod] = (a: any, b: any, c: any) => {
          const scope = ui.table.rebuildRenderScope(a, b, c);
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
    rowHandle[ui.table.renderMethod] = (a: any, b: any, c: any) => {
      const scope = ui.table.rebuildRenderScope(a, b, c);
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
      type: Array
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
    const tableRef = ref();
    const componentRefs = ref([]);
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
        ui.table.scrollTo({
          top: 0,
          tableRef,
          fsTableRef: currentRef
        });
        ctx.emit("data-change", { data: value });
      }
    );

    const tableComp = resolveDynamicComponent(ui.table.name);
    const tableColumnCI = ui.tableColumn;

    const editableWrap = useEditable(props, ctx, tableRef);

    const getContextFn = (item: any, scope: any): ScopeContext => {
      const row = scope[tableColumnCI.row];
      const form = row;
      const index = scope[ui.tableColumn.index];
      scope.index = index;
      return {
        ...scope,
        key: item.key,
        value: _.get(row, item.key),
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

    const events = ui.table.onChange({
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
      scope.index = scope[ui.tableColumn.index];
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
      // console.log("render cell component",item.key,scope.record)
      const cellSlotName = "cell_" + item.key;
      const row = (scope.row = scope[tableColumnCI.row]);
      // const getScopeFn = () => {
      //   return getContextFn(item, scope);
      // };
      const newScope = getContextFn(item, scope);
      const vModel = {
        modelValue: _.get(scope[tableColumnCI.row], item.key),
        "onUpdate:modelValue": (value: any) => {
          _.set(scope[tableColumnCI.row], item.key, value);
          ctx.emit("value-change", newScope);
          if (item.valueChange) {
            item.valueChange(newScope);
          }
        }
      };
      const setRef = (el: any) => {
        const index = scope[ui.tableColumn.index];
        const key = item.key;
        let rowRefs = componentRefs.value[index];
        if (rowRefs == null) {
          componentRefs.value[index] = rowRefs = {};
        }
        rowRefs[key] = el;
      };

      const index = scope[ui.tableColumn.index];
      const editableId = row[props.editable?.rowKey];

      const cellSlots = props.cellSlots && props.cellSlots[cellSlotName];
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
      ...editableWrap
    });

    const renderMode = ui.table.renderMode;
    const dataSource = computed(() => {
      return {
        [ui.table.data]: props.data
      };
    });

    const computedBinding = computed(() => {
      return _.merge({}, ctx.attrs, events);
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
        if (typeof ui.table.vLoading === "string") {
          const loading = resolveDirective(ui.table.vLoading);
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

      return () => {
        if (props.show === false) {
          return;
        }
        return (
          <tableComp
            ref={tableRef}
            loading={props.loading}
            rowKey={props.rowKey}
            {...computedBinding.value}
            columns={computedColumns.value}
            {...dataSource.value}
            v-slots={props.slots}
          />
        );
      };
    }
  }
});
