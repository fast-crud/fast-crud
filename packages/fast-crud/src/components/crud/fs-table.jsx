import { computed, ref, resolveDirective, resolveDynamicComponent, watch, withDirectives } from "vue";
import _ from "lodash-es";
import { uiContext } from "../../ui";
import { useEditable } from "./editable/use-editable";
import logger from "../../utils/util.log";
import utilLog from "../../utils/util.log";
import "./fs-table.less";

function buildTableSlots({ props, ctx, ui, getContextFn, componentRefs, renderRowHandle, renderCellComponent }) {
  const tableComp = resolveDynamicComponent(ui.table.name);
  const tableColumnComp = resolveDynamicComponent(ui.tableColumn.name);
  const tableColumnGroupComp = resolveDynamicComponent(ui.tableColumnGroup.name);
  const tableColumnCI = ui.tableColumn;
  const tableSlots = {};
  tableSlots.default = () => {
    const children = [];
    const buildColumn = (item) => {
      let cellSlots = {};
      const cellSlotName = "cell_" + item.key;
      let currentTableColumnComp = tableColumnComp;
      if (item.children && item.children.length > 0) {
        //subColumns
        cellSlots.default = () => {
          const subColumns = [];
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
        cellSlots.default = (scope) => {
          return renderCellComponent(item, scope);
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
    _.forEach(props.columns, (item) => {
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
 * @param ctx
 * @param ui
 * @param getContextFn
 * @param componentRefs
 * @param renderRowHandle
 * @returns {*[]}
 */
function buildTableColumns(options) {
  const { props, ctx, ui, getContextFn, componentRefs, renderRowHandle, renderCellComponent } = options;
  let originalColumns = options.columns ?? [];
  const columns = [];

  for (let column of originalColumns) {
    if (column.show === false) {
      continue;
    }
    const item = { ...column };
    item.dataIndex = column.key;
    columns.push(item);
    if (column.children != null) {
      // 表头分组
      const childOptions = { ...options, columns: column.children };
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
        item[ui.table.renderMethod] = (a, b, c) => {
          const scope = ui.table.rebuildRenderScope(a, b, c);
          return renderCellComponent(newCol, scope);
        };
      } else {
        //配置了customRender,先走customRender，在内部让用户根据情况调用cellRender
        item[ui.table.renderMethod] = (a, b, c) => {
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
    let rowHandle = {
      key: "_rowHandle",
      ...props.rowHandle
    };
    rowHandle[ui.table.renderMethod] = (a, b, c) => {
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
export default {
  name: "FsTable",
  props: {
    /**
     * table插槽
     */
    slots: {},
    /**
     * 单元格插槽
     */
    cellSlots: {},
    /**
     * 列配置，支持el-table-column|a-table-column配置
     */
    columns: {
      type: Array,
      default: undefined
    },
    /**
     * 操作列
     */
    rowHandle: {
      type: Object
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

    /**
     * 行编辑，批量编辑
     */
    editable: {
      type: Object
    },
    request: {}
  },
  emits: ["row-handle", "value-change", "pagination-change", "filter-change", "sort-change", "data-change"],
  setup(props, ctx) {
    const tableRef = ref();
    const componentRefs = ref([]);
    const getComponentRef = (index, key) => {
      if (!key || index == null || index > componentRefs.value.length) {
        return;
      }
      const row = componentRefs.value[index];
      const cellRef = row[key];
      return cellRef?.getTargetRef();
    };

    watch(
      () => {
        return props.data;
      },
      (value) => {
        ctx.emit("data-change", { data: value });
      }
    );

    const ui = uiContext.get();
    const tableComp = resolveDynamicComponent(ui.table.name);
    const tableColumnCI = ui.tableColumn;

    const editableWrap = useEditable(props, ctx, tableRef);

    const getContextFn = (item, scope) => {
      const row = scope[tableColumnCI.row];
      const form = row;
      const index = scope[ui.tableColumn.index];
      scope.index = index;
      return {
        ...scope,
        key: item.key,
        value: row[item.key],
        row,
        form,
        getComponentRef: (key) => {
          return getComponentRef(index, key);
        }
      };
    };

    function onRowHandle(context) {
      ctx.emit("row-handle", context);
    }

    const events = ui.table.onChange({
      onSortChange: (sorter) => {
        ctx.emit("sort-change", sorter);
      },
      onFilterChange: (filters) => {
        ctx.emit("filter-change", filters);
      }
    });

    const renderRowHandle = (scope) => {
      scope.index = scope[ui.tableColumn.index];
      const rowHandleSlotsName = "cell-rowHandle";
      const rowHandleSlots = {};
      if (props.cellSlots) {
        for (let key in props.cellSlots) {
          if (key.startsWith(rowHandleSlotsName)) {
            rowHandleSlots[key] = props.cellSlots[key];
          }
        }
      }
      return <fs-row-handle {...props.rowHandle} scope={scope} onHandle={onRowHandle} v-slots={rowHandleSlots} />;
    };

    const renderCellComponent = (item, scope) => {
      // console.log("render cell component",item.key,scope.record)
      const cellSlotName = "cell_" + item.key;
      scope.row = scope[tableColumnCI.row];
      const getScopeFn = () => {
        return getContextFn(item, scope);
      };
      const vModel = {
        modelValue: scope[tableColumnCI.row][item.key],
        "onUpdate:modelValue": (value) => {
          scope[tableColumnCI.row][item.key] = value;
          const newScope = getContextFn(item, scope);
          ctx.emit("value-change", newScope);
          const key = newScope.key;
          for (let column of props.columns) {
            if (column.key === key) {
              if (column.valueChange) {
                column.valueChange(newScope);
              }
              break;
            }
          }
        }
      };
      const setRef = (el) => {
        const index = scope[ui.tableColumn.index];
        const key = item.key;
        let rowRefs = componentRefs.value[index];
        if (rowRefs == null) {
          componentRefs.value[index] = rowRefs = {};
        }
        rowRefs[key] = el;
      };

      const index = scope[ui.tableColumn.index];

      const cellSlots = props.cellSlots && props.cellSlots[cellSlotName];
      if (editableWrap.editable?.options?.value?.enabled === true) {
        // if (props.editable && props.editable?.options?.value?.enabled === true) {
        const editable = editableWrap.editable.getEditableCell(index, item.key);
        return (
          <fs-editable-cell
            ref={setRef}
            columnKey={item.key}
            index={index}
            item={item}
            editable={editable}
            getScope={getScopeFn}
            slots={cellSlots}
            {...vModel}
          />
        );
      } else {
        return <fs-cell ref={setRef} item={item} getScope={getScopeFn} slots={cellSlots} {...vModel} />;
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
    if (renderMode === "slot") {
      const computedTableSlots = computed(() => {
        return buildTableSlots({ props, ctx, ui, getContextFn, componentRefs, renderRowHandle, renderCellComponent });
      });

      // 使用config render
      return () => {
        if (props.show === false) {
          return;
        }
        const dataSource = {
          [ui.table.data]: props.data
        };
        const tableRender = (
          <tableComp ref={tableRef} {...ctx.attrs} {...events} {...dataSource} v-slots={computedTableSlots.value} />
        );
        if (ui.table.vLoading) {
          const loading = resolveDirective(ui.table.vLoading);
          return withDirectives(tableRender, [[loading, ctx.attrs.loading]]);
        }
        return tableRender;
      };
    } else {
      const computedColumns = computed(() => {
        return buildTableColumns({
          props,
          ctx,
          ui,
          getContextFn,
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

        const dataSource = {
          [ui.table.data]: props.data
        };
        return (
          <tableComp
            ref={tableRef}
            {...ctx.attrs}
            {...events}
            columns={computedColumns.value}
            {...dataSource}
            v-slots={props.slots}
          />
        );
      };
    }
  }
};
