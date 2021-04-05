import {
  getCurrentInstance,
  ref,
  resolveDirective,
  resolveDynamicComponent,
  withDirectives,
} from "vue";
import _ from "lodash-es";
import FsRowHandle from "./fs-row-handle.vue";
import FsComponentRender from "../render/fs-component-render";
import "./fs-table.less";
import { uiContext } from "../../ui";

export default {
  name: "FsTable",
  components: { FsComponentRender, FsRowHandle },
  props: {
    slots: {},
    columns: {},
    rowHandle: {},
    show: {},
    data: {},
  },
  emits: ["row-handle", "value-change"],
  setup() {
    const tableRef = ref();
    const componentRefs = ref([]);
    const getComponentRef = (index, key) => {
      if (!key || index == null || index > componentRefs.value.length) {
        return;
      }
      const row = componentRefs.value[index];
      const cellRef = row[key];
      return cellRef.getTargetRef();
    };
    return {
      tableRef,
      componentRefs,
      getComponentRef,
    };
  },
  methods: {
    onRowHandle(context) {
      this.$emit("row-handle", context);
    },
  },
  render() {
    if (this.show === false) {
      return;
    }
    const ui = uiContext.get();
    const { proxy } = getCurrentInstance();
    const tableComp = resolveDynamicComponent(proxy.$fsui.table.name);

    const tableSlots = {};

    const templateMode = true;
    const tableColumnCI = proxy.$fsui.tableColumn;
    if (templateMode) {
      const tableColumnComp = resolveDynamicComponent(tableColumnCI.name);
      const tableColumnGroupComp = resolveDynamicComponent(
        proxy.$fsui.tableColumnGroup.name
      );

      const getContextFn = (item, scope) => {
        const row = scope[tableColumnCI.row];
        const form = row;
        const getComponentRef = (key) => {
          const index = scope.index;
          return this.getComponentRef(index, key);
        };
        return {
          ...scope,
          key: item.key,
          value: row[item.key],
          row,
          form,
          getComponentRef,
        };
      };

      tableSlots.default = () => {
        const children = [];
        const buildColumn = (item) => {
          let cellSlots = {};
          let currentTableColumnComp = tableColumnComp;
          const cellSlotName = "cell_" + item.key;
          if (item.children && item.children.length > 0) {
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
          } else if (this.slots && this.slots[cellSlotName]) {
            cellSlots.default = (scope) => {
              scope.row = scope[tableColumnCI.row];
              return this.slots[cellSlotName](scope);
            };
          } else if (item.component) {
            cellSlots.default = (scope) => {
              scope.row = scope[tableColumnCI.row];
              const getScopeFn = () => {
                return getContextFn(item, scope);
              };
              const vModel = {
                modelValue: scope[tableColumnCI.row][item.key],
                "onUpdate:modelValue": (value) => {
                  scope[tableColumnCI.row][item.key] = value;
                  const newScope = getContextFn(item, scope);
                  this.$emit("value-change", newScope);
                  const key = newScope.key;
                  for (let column of this.columns) {
                    if (column.key === key) {
                      if (column.valueChange) {
                        column.valueChange(newScope);
                      }
                      break;
                    }
                  }
                },
              };
              const setRef = (el) => {
                const index = scope.index;
                const key = item.key;
                let row = this.componentRefs[index];
                if (row == null) {
                  this.componentRefs[index] = row = {};
                }
                row[key] = el;
              };
              return (
                <fs-cell
                  ref={setRef}
                  component={item.component}
                  getScope={getScopeFn}
                  {...vModel}
                />
              );
            };
          } else if (item.formatter) {
            cellSlots.default = (scope) => {
              const newScope = getContextFn(item, scope);
              return item.formatter(newScope);
            };
          } else {
            cellSlots = null;
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
        _.forEach(this.columns, (item) => {
          if (item.show === false) {
            return;
          }
          children.push(buildColumn(item));
        });

        // rowHandle
        if (this.rowHandle && this.rowHandle.show !== false) {
          const rowHandleSlots = {
            default: (scope) => {
              return (
                <fs-row-handle
                  {...this.rowHandle}
                  scope={scope}
                  onHandle={this.onRowHandle}
                />
              );
            },
          };
          children.push(
            <tableColumnComp
              ref={"tableColumnRef"}
              {...this.rowHandle}
              label={this.rowHandle.title}
              prop={this.rowHandle.key || "rowHandle"}
              v-slots={rowHandleSlots}
            />
          );
        }
        return children;
      };
    }
    const dataSource = {
      [proxy.$fsui.table.data]: this.data,
    };

    const tableRender = (
      <tableComp
        ref={"tableRef"}
        {...this.$attrs}
        {...dataSource}
        v-slots={tableSlots}
      />
    );
    if (proxy.$fsui.table.vLoading) {
      const loading = resolveDirective(proxy.$fsui.table.vLoading);
      return withDirectives(tableRender, [[loading, this.$attrs.loading]]);
    }
    return tableRender;
  },
};
