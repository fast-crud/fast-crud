import "vue/jsx";
import type {
  TextAreaCI,
  CI,
  UiInterface,
  DialogCI,
  TableColumnCI,
  Icons,
  IconCI,
  TableCI,
  SelectCI,
  MessageCI,
  NotificationCI,
  MessageBoxCI,
  InputCI,
  OptionCI,
  FormWrapperCI,
  FormItemCI,
  DrawerCI,
  CheckboxCI,
  RadioCI,
  RadioGroupCI,
  TagCI,
  CheckboxGroupCI,
  CascaderCI,
  SwitchCI,
  InputPasswordCI,
  InputGroupCI,
  DatePickerCI,
  TimePickerCI,
  DropdownCI,
  DropdownMenuCI,
  DropdownItemCI,
  ImageGroupCI,
  ImageCI,
  ProgressCI,
  LoadingCI,
  UploadCI,
  TreeSelectCI,
  TabsCI,
  TabPaneCI,
  CollapseCI,
  CollapseItemCI,
  ButtonCI,
  PaginationCI,
  DividerCI,
  FormCI,
  PopoverCI,
  TooltipCI,
  InputNumberCI,
  BadgeCI,
  CollapseTransitionCI,
  ButtonGroupCI,
  ColCI,
  RowCI,
  CardCI,
  TableScrollReq,
  RadioButtonCI
} from "@fast-crud/ui-interface";
import { useUiRender } from "@fast-crud/ui-interface";
// @ts-ignore
import { isFunction, forEach, union } from "lodash-es";
import { CheckboxValueType, ElDialog, TableV2Placeholder, useFormItem } from "element-plus";
import { computed, ref, unref } from "vue";

export type ElementUiProvider = {
  Notification: any;
  Message: any;
  MessageBox: any;
};

const { buildBinding, creator } = useUiRender();
export class Element implements UiInterface {
  constructor(target?: ElementUiProvider) {
    if (target) {
      this.notification.instance = target.Notification;
      this.message.instance = target.Message;
      this.messageBox.instance = target.MessageBox;
    }
  }

  type = "element";
  modelValue = "modelValue";

  switch: SwitchCI = creator<SwitchCI>({
    activeColor: "active-color",
    activeText: "active-text",
    activeValue: "active-value",
    inactiveColor: "inactive-color",
    inactiveText: "inactive-text",
    inactiveValue: "inactive-value",
    modelValue: "modelValue",
    name: "el-switch"
  });

  formWrapper: FormWrapperCI = creator<FormWrapperCI>({
    visible: "modelValue",
    customClass: (is: string) => {
      return "class";
    },
    titleSlotName: "header",
    buildOnClosedBind(is: string, onClosed: Function) {
      return { onClosed };
    },
    buildWidthBind(is, width) {
      return { width: width };
    },
    buildInitBind(is) {
      return {};
    },
    buildInnerBind() {
      return {};
    },
    name: "fs-form-wrapper"
  });

  messageBox: MessageBoxCI = creator<MessageBoxCI>({
    name: "el-message-box",
    instance: undefined,
    open: async (context) => {
      return this.messageBox.instance(context);
    },
    confirm: async (context) => {
      return this.messageBox.instance(context);
    }
  });

  message: MessageCI = creator<MessageCI>({
    instance: undefined,
    name: "el-message",
    open: (context) => {
      this.message.instance.open(context);
    },
    success: (msg) => {
      this.message.instance.success(msg);
    },
    error: (msg) => {
      this.message.instance.error(msg);
    },
    warn: (msg) => {
      this.message.instance.warning(msg);
    },
    info: (msg) => {
      this.message.instance(msg);
    }
  });

  notification: NotificationCI = creator<NotificationCI>({
    instance: undefined,
    name: "el-notification",
    open: (context) => {
      this.notification.instance.open(context);
    },
    success: (msg) => {
      this.notification.instance.success(msg);
    },
    error: (msg) => {
      this.notification.instance.error(msg);
    },
    warn: (msg) => {
      this.notification.instance.warn(msg);
    },
    info: (msg) => {
      this.notification.instance.success(msg);
    }
  });

  icon: IconCI = creator<IconCI>({
    name: "",
    isComponent: false
  });

  icons: Icons = {
    add: "plus",
    columnsFilter: "set-up",
    compact: "rank",
    edit: "edit",
    remove: "delete",
    search: "search",
    refresh: "refresh",
    export: "upload",
    check: "check",
    sort: "sort",
    left: "arrow-left",
    right: "arrow-right",
    close: "close",
    arrowLeft: "left",
    arrowRight: "right",
    more: "more",
    plus: "plus",
    zoomIn: "zoom-in",
    zoomOut: "zoom-out",
    refreshLeft: "refresh-left",
    refreshRight: "refresh-right",
    upload: "upload",
    fullScreen: "full-screen",
    unFullScreen: "full-screen",
    question: "question-filled",
    caretUp: "CaretTop",
    caretDown: "CaretBottom",
    eye: "View",
    info: "warning"
  };

  dialog: DialogCI = creator<DialogCI>({
    name: "el-dialog",
    visible: "modelValue",
    customClass: "class",
    titleSlotName: "header",
    footerSlotName: "footer",
    buildOnClosedBind(onClosed) {
      return { onClosed };
    },
    footer() {
      return {};
    },
    open(opts) {
      ElDialog.open(opts);
    },
    builder(opts) {
      return buildBinding(this, opts, {
        props: {
          title: opts.title,
          width: opts.width
        },
        slots: {
          footer: opts.footer
        }
      });
    }
  });

  buttonGroup = creator<ButtonGroupCI>({
    name: "el-button-group"
  });

  col = creator<ColCI>({
    name: "el-col"
  });

  row = creator<RowCI>({
    name: "el-row"
  });

  card = creator<CardCI>({
    name: "el-card"
  });

  checkboxGroup: CheckboxGroupCI = creator<CheckboxGroupCI>({
    name: "el-checkbox-group",
    modelValue: "modelValue"
  });
  checkbox: CheckboxCI = creator<CheckboxCI>({
    name: "el-checkbox",
    resolveEvent(e: any) {
      return e;
    },
    modelValue: "modelValue",
    value: "value",
    onChange(callback: (e: any) => void) {
      return {
        "onUpdate:modelValue": callback
      };
    }
  });

  drawer: DrawerCI = creator<DrawerCI>({
    name: "el-drawer",
    visible: "modelValue",
    customClass: "class",
    width: "size"
  });

  collapseTransition = creator<CollapseTransitionCI>({
    name: "el-collapse-transition"
  });

  option: OptionCI = creator<OptionCI>({
    name: "el-option",
    value: "value",
    label: "label"
  });

  select: SelectCI = creator<SelectCI>({
    name: "el-select",
    modelValue: "modelValue",
    clearable: "clearable",
    filterable: "filterable",
    buildMultiBinding(multiple) {
      return { multiple };
    }
  });

  treeSelect: TreeSelectCI = creator<TreeSelectCI>({
    name: "el-tree-select",
    modelValue: "modelValue",
    clearable: "select.clearable",
    options: "data",
    value: "tree.value",
    label: "tree.label",
    children: "tree.children",
    buildOptionKeysNameBinding(param: { children: any; label: any; value: any }): any {
      return {
        props: {
          label: param.label,
          value: param.value,
          children: param.children
        }
      };
    }
  });

  radio: RadioCI = creator<RadioCI>({
    name: "el-radio",
    value: "value",
    builder(opts) {
      return buildBinding(this, opts, {
        props: {
          [this.value]: opts.value
        }
      });
    }
  });

  radioButton: RadioButtonCI = creator<RadioButtonCI>({
    name: "el-radio-button",
    value: "value",
    builder(opts) {
      return buildBinding(this, opts, {
        props: {
          [this.value]: opts.value
        }
      });
    }
  });

  radioGroup: RadioGroupCI = creator<RadioGroupCI>({
    name: "el-radio-group",
    modelValue: "modelValue"
  });

  cascader: CascaderCI = creator<CascaderCI>({
    name: "el-cascader",
    modelValue: "modelValue",
    clearable: "clearable",
    fieldNames(namesMap: any) {
      return {
        props: namesMap
      };
    }
  });

  form: FormCI = creator<FormCI>({
    name: "el-form",
    inlineLayout: {
      layout: "inline",
      inline: true
    },
    validateWrap: async (formRef) => {
      return formRef.validate();
    },
    transformValidateErrors: (e: any) => {
      const errors: any = {};
      forEach(e, (item, key) => {
        errors[key] = true;
      });

      return errors;
    }
  });

  formItem: FormItemCI = creator<FormItemCI>({
    name: "el-form-item",
    prop: "prop",
    label: "label",
    rules: "rules",
    skipValidationWrapper: "div",
    injectFormItemContext() {
      const { formItem } = useFormItem();
      return {
        async onChange() {
          await formItem?.validate("change");
        },
        async onBlur() {
          await formItem?.validate("blur");
        }
      };
    },
    builder(opts) {
      return buildBinding(this, opts, {});
    }
  });

  button: ButtonCI = creator<ButtonCI>({
    name: "el-button",
    textType: { text: true },
    linkType: { link: true, type: "primary" },
    circle: { circle: true },
    colors: (type) => {
      return { type };
    }
  });

  pagination: PaginationCI = creator<PaginationCI>({
    name: "el-pagination",
    currentPage: "currentPage",
    total: "total", //总条数
    pageCount: null,
    onChange({ setCurrentPage, setPageSize, doAfterChange }) {
      return {
        // element 页码改动回调
        onCurrentChange(event: any) {
          setCurrentPage(event);
          doAfterChange();
        },
        onSizeChange(event: any) {
          setPageSize(event);
          doAfterChange();
        }
      };
    }
  });

  tableColumn: TableColumnCI = creator<TableColumnCI>({
    name: "el-table-column",
    label: "label",
    prop: "prop",
    row: "row",
    index: "$index"
  });

  tableColumnGroup: TableColumnCI = creator<TableColumnCI>({
    name: "el-table-column",
    label: "label",
    prop: "prop",
    row: "row",
    index: "$index"
  });

  table: TableCI = creator<TableCI>({
    name: "el-table",
    data: "data",
    renderMode: "slot",
    defaultRowKey: "id",
    fixedHeaderNeedComputeBodyHeight: false,
    buildMaxHeight: (maxHeight) => {
      return { maxHeight };
    },
    hasMaxHeight: (options) => {
      return options?.maxHeight != null;
    },
    headerDomSelector: "",
    vLoading: "loading",
    // 没太大用
    setSelectedRows({ multiple, selectedRowKeys, tableRef, getRowKey }) {
      const rowKey: any = getRowKey();
      const curSelectedRows = [];
      for (const key of selectedRowKeys.value) {
        for (const row of tableRef.data) {
          if (row[rowKey] === key) {
            curSelectedRows.push(row);
          }
        }
      }
      if (multiple) {
        for (const row of curSelectedRows) {
          tableRef.toggleRowSelection(row, true);
        }
      } else {
        if (selectedRowKeys.value.length > 0) {
          tableRef.setCurrentRow(curSelectedRows[0]);
        }
      }
    },
    buildSelectionCrudOptions(req) {
      const { compute } = req.useCompute();
      function getCrossPageSelected(curSelectedIds: any[]) {
        const rowKey: any = req.getRowKey();
        const data = req.getPageData();
        let mapId = rowKey;
        if (!isFunction(rowKey)) {
          mapId = (item: any) => {
            return item[rowKey];
          };
        }
        const currentIds = data.map(mapId);
        //已选中数据中，排除掉本页数据
        const selectedRowKeys = req.selectedRowKeys instanceof Function ? req.selectedRowKeys() : req.selectedRowKeys;
        if (!selectedRowKeys.value) {
          selectedRowKeys.value = [];
        }
        const otherPageSelected = selectedRowKeys.value.filter((item: any) => !currentIds.includes(item));
        return union(otherPageSelected, curSelectedIds);
      }

      if (req.multiple) {
        const onSelectionChange = (changedRows: any[] = []) => {
          const rowKey = req.getRowKey();
          let selectedKeys = changedRows.map((item: any) => item[rowKey]);
          if (req.crossPage) {
            selectedKeys = getCrossPageSelected(selectedKeys);
          }
          req.onSelectedKeysChanged(selectedKeys);
        };
        return {
          table: {
            onSelectionChange
          },
          columns: {
            $checked: {
              form: { show: false },
              column: {
                type: "selection",
                align: "center",
                width: "55px",
                order: -9999,
                reserveSelection: req.crossPage,
                columnSetDisabled: true //禁止在列设置中选择
              }
            }
          }
        };
      } else {
        //单选
        const onCurrentChange = (changed: any) => {
          if (changed == null) {
            req.onSelectedKeysChanged([]);
            return;
          }
          const rowKey = req.getRowKey();
          const selectedKeys = [changed[rowKey]];
          req.onSelectedKeysChanged(selectedKeys);
        };
        const selectedRowKeys = req.selectedRowKeys instanceof Function ? req.selectedRowKeys() : req.selectedRowKeys;
        const modelValue = computed(() => {
          return selectedRowKeys.value.length > 0 ? selectedRowKeys.value[0] : null;
        });
        return {
          table: {
            highlightCurrentRow: true,
            onCurrentChange: onCurrentChange
          },
          columns: {
            $selected: {
              form: { show: false },
              column: {
                align: "center",
                width: "55px",
                order: -9999,
                component: {
                  name: "el-radio",
                  label: compute((ctx: any) => {
                    if (ctx.form) {
                      return ctx.form[req.getRowKey()];
                    }
                  }),
                  props: {
                    modelValue: modelValue
                  },
                  slots: {
                    default() {
                      return "";
                    }
                  }
                },
                conditionalRender: {
                  match() {
                    return false;
                  }
                }
              }
            }
          }
        };
      }
    },
    rebuildRenderScope: (scope) => {
      return scope;
    },
    scrollTo(req: TableScrollReq) {
      req.tableRef?.value?.setScrollTop(req.top);
    },
    onChange({ onSortChange, onFilterChange, bubbleUp }) {
      return {
        onSortChange: (ctx: any) => {
          const { column, prop, order } = ctx;
          if (onSortChange) {
            onSortChange({
              isServerSort: prop && column.sortable === "custom",
              prop,
              order,
              asc: order === "ascending"
            });
          }

          bubbleUp((events: any) => {
            if (events.onSortChange) {
              events.onSortChange(ctx);
            }
          });
        },
        onFilterChange: (filters: any) => {
          onFilterChange(filters);
          bubbleUp((events: any) => {
            if (events.onFilterChange) {
              events.onFilterChange(filters);
            }
          });
        }
      };
    }
  });

  tableColumnV2: TableColumnCI = creator<TableColumnCI>({
    name: "el-table-column",
    label: "label",
    prop: "prop",
    row: "row",
    index: "$index"
  });

  tableColumnGroupV2: TableColumnCI = creator<TableColumnCI>({
    name: "el-table-column",
    label: "label",
    prop: "prop",
    row: "row",
    index: "$index"
  });

  tableV2: TableCI = creator<TableCI>({
    name: "el-table-v2",
    data: "data",
    renderMode: "jsx",
    defaultRowKey: "id",
    fixedHeaderNeedComputeBodyHeight: false,
    renderMethod: "cellRenderer",
    columnsIsFlat: true,
    //构建自定义表头插槽方法，element-table-v2需要自己写多级表头
    buildMultiHeadersBind(opts) {
      const flatColumns = opts.flatColumns;
      const treeColumns = opts.treeColumns;

      function deepOfColumns(columns: any, deep = 1) {
        let maxDeep = 0;
        for (const column of columns) {
          if (column._parent == null) {
            maxDeep = Math.max(maxDeep, deep);
          } else {
            const res = deepOfColumns([column._parent], deep + 1);
            maxDeep = Math.max(maxDeep, res);
          }
        }
        return maxDeep;
      }

      let lineHeight = 50;
      const maxDeep = deepOfColumns(flatColumns);
      if (maxDeep > 1) {
        lineHeight = lineHeight - (maxDeep - 1) * 10;
        lineHeight = Math.max(30, lineHeight);
      }
      const maxHeight = maxDeep * lineHeight;

      function getSubColumns(parents: any[]) {
        const subs = [];
        for (const col of parents) {
          if (col.children && col.children.length > 0) {
            subs.push(...col.children);
          } else {
            subs.push(col);
          }
        }
        return subs;
      }
      function findLeaf(parents: any[]) {
        const leafs: any[] = [];
        for (const col of parents) {
          if (col.children && col.children.length > 0) {
            leafs.push(...findLeaf(col.children));
          } else {
            leafs.push(col);
          }
        }
        return leafs;
      }

      function countLeafWidth(parents: any[]) {
        const leafs = findLeaf(parents);
        let width = 0;
        for (const leaf of leafs) {
          width += leaf.width;
        }
        return width;
      }

      return {
        bind: {
          headerHeight: maxHeight
        },
        slots: {
          header: ({ cells, columns, headerIndex }: any) => {
            //
            const elColumnsMap: any = {};
            columns.forEach((column: any, index: number) => {
              elColumnsMap[column.key] = {
                column,
                index
              };
            });

            const groupCells: any = [];
            const usedLeafKeys: any = [];
            function buildHeadTree(treeColumns: any[], deep: number) {
              const groupCells = [];
              for (const col of treeColumns) {
                //子节点
                if (!col.children || col.children.length == 0) {
                  groupCells.push(
                    <div
                      class="custom-header-cell fs-multi-head-text el-table-v2__header-cell-text"
                      style={{ width: col.width + "px", height: lineHeight * deep + "px", justifyContent: col.align }}
                    >
                      {col.title}
                    </div>
                  );
                  usedLeafKeys.push(col.key);
                } else {
                  //有子节点
                  const width = countLeafWidth(col.children);
                  groupCells.push(
                    <div class="fs-multi-head-group ">
                      <div
                        class="custom-header-cell fs-multi-head-text el-table-v2__header-cell-text"
                        style={{ width: width + "px", height: lineHeight + "px", justifyContent: col.align }}
                      >
                        {col.title}
                      </div>
                      <div class={"fs-multi-head-sub "}>{buildHeadTree(col.children, deep - 1)}</div>
                    </div>
                  );
                }
              }
              return groupCells;
            }

            function findTopParent(column: any, deep = 1) {
              if (column._parent) {
                deep = deep + 1;
                return findTopParent(column._parent, deep);
              }
              return {
                parent: column,
                deep
              };
            }
            columns.forEach((column: any, index: number) => {
              if (column?.placeholderSign === TableV2Placeholder) {
                groupCells.push(cells[index]);
                return;
              }

              if (usedLeafKeys.includes(column.key)) {
                return;
              }

              if (column._parent) {
                const { parent, deep } = findTopParent(column);
                //构建子节点
                const headerCell = buildHeadTree([parent], maxDeep);
                groupCells.push(...headerCell);
              } else {
                // groupCells.push(
                //   <div class="fs-multi-head-group ">
                //     <div
                //       class="  custom-header-cell fs-multi-head-text"
                //       style={{ width: column.width + "px", height: lineHeight * maxDeep + "px" }}
                //     >
                //       {column.title}
                //     </div>
                //   </div>
                // );
                groupCells.push(cells[index]);
              }
            });

            return groupCells;
          }
        }
      };
    },
    rebuildRenderScope: (scope: {
      cellData: any;
      column: any;
      columns: any[];
      columnIndex: number;
      rowData: any;
      rowIndex: number;
    }) => {
      /*
      
       */
      return { ...scope, index: scope.rowIndex, row: scope.rowData };
    },
    buildMaxHeight: (maxHeight) => {
      return { maxHeight };
    },
    hasMaxHeight: (options) => {
      return false;
    },
    headerDomSelector: "",
    vLoading: "loading",
    // 没太大用
    setSelectedRows({ multiple, selectedRowKeys, tableRef, getRowKey }) {
      const rowKey: any = getRowKey();
      const curSelectedRows = [];
      for (const key of selectedRowKeys.value) {
        for (const row of tableRef.data) {
          if (row[rowKey] === key) {
            curSelectedRows.push(row);
          }
        }
      }
      if (multiple) {
        for (const row of curSelectedRows) {
          tableRef.toggleRowSelection(row, true);
        }
      } else {
        if (selectedRowKeys.value.length > 0) {
          tableRef.setCurrentRow(curSelectedRows[0]);
        }
      }
    },
    buildSelectionCrudOptions(req) {
      const onSelectionChange = (changed: any = []) => {
        req.onSelectedKeysChanged(changed);
      };

      const { selectedRowKeys } = unref(req);
      return {
        table: {
          // checkedRowKeys: req.selectedRowKeys,
          // "onUpdate:checkedRowKeys": onSelectionChange
        },
        columns: {
          $checked: {
            form: { show: false },
            column: {
              multiple: !!req.multiple,
              align: "center",
              width: 80,
              order: -9999,
              fixed: req.selectionFixed,
              columnSetDisabled: true, //禁止在列设置中选择
              cellRenderer: ({ rowData }: any) => {
                const selectedRowKeys =
                  req.selectedRowKeys instanceof Function ? req.selectedRowKeys() : req.selectedRowKeys;
                if (!selectedRowKeys.value) {
                  selectedRowKeys.value = [];
                }
                const onChange = (value: CheckboxValueType) => {
                  if (value) {
                    //选中
                    selectedRowKeys.value.push(rowData[req.getRowKey()]);
                  } else {
                    //取消选中
                    selectedRowKeys.value = selectedRowKeys.value.filter(
                      (key: any) => key !== rowData[req.getRowKey()]
                    );
                  }

                  onSelectionChange(selectedRowKeys.value);
                };

                const checked = selectedRowKeys.value.includes(rowData[req.getRowKey()]);

                //@ts-ignore
                return <ElCheckbox onChange={onChange} modelValue={checked} />;
              },

              headerCellRenderer: (ctx: any) => {
                const _data = req.getPageData() || [];
                const selectedRowKeys =
                  req.selectedRowKeys instanceof Function ? req.selectedRowKeys() : req.selectedRowKeys;
                const onChange = (value: CheckboxValueType) => {
                  if (value) {
                    //选中
                    selectedRowKeys.value = _data.map((row) => row[req.getRowKey()]);
                  } else {
                    //取消选中
                    selectedRowKeys.value = [];
                  }
                };

                const allSelected =
                  _data.length > 0 && _data.every((row) => selectedRowKeys.value.includes(row[req.getRowKey()]));
                const containsChecked = _data.some((row) => selectedRowKeys.value.includes(row[req.getRowKey()]));

                return (
                  <el-checkbox
                    onChange={onChange}
                    modelValue={allSelected}
                    indeterminate={containsChecked && !allSelected}
                  />
                );
              }
            }
          }
        }
      };
    },
    scrollTo(req: TableScrollReq) {
      req.tableRef?.value?.scrollToTop(req.top);
    },
    onChange({ onSortChange, onFilterChange, bubbleUp }) {
      return {
        onSortChange: (ctx: any) => {
          const { column, prop, order } = ctx;
          if (onSortChange) {
            onSortChange({
              isServerSort: prop && column.sortable === "custom",
              prop,
              order,
              asc: order === "ascending"
            });
          }

          bubbleUp((events: any) => {
            if (events.onSortChange) {
              events.onSortChange(ctx);
            }
          });
        },
        onFilterChange: (filters: any) => {
          onFilterChange(filters);
          bubbleUp((events: any) => {
            if (events.onFilterChange) {
              events.onFilterChange(filters);
            }
          });
        }
      };
    }
  });

  textArea: TextAreaCI = creator<TextAreaCI>({
    name: "el-input",
    type: "textarea",
    modelValue: "modelValue",
    clearable: "clearable"
  });

  tag: TagCI = creator<TagCI>({
    name: "el-tag",
    type: "type",
    colors: ["info", "success", "warning", "danger"]
  });

  inputGroup: InputGroupCI = creator<InputGroupCI>({
    name: "el-input-group"
  });
  input: InputCI = creator<InputCI>({
    name: "el-input",
    clearable: "clearable",
    modelValue: "modelValue"
  });
  inputPassword: InputPasswordCI = creator<InputPasswordCI>({
    name: "el-input",
    clearable: "clearable",
    modelValue: "modelValue",
    passwordType: { showPassword: true }
  });
  number: InputNumberCI = creator<InputNumberCI>({
    name: "el-input-number",
    modelValue: "modelValue",
    builder(opts) {
      return buildBinding(this, opts, {});
    }
  });
  datePicker: DatePickerCI = creator<DatePickerCI>({
    name: "el-date-picker",
    modelValue: "modelValue",
    buildDateType(type) {
      return { name: "el-date-picker", type };
    }
  });
  timePicker: TimePickerCI = creator<TimePickerCI>({
    name: "el-time-picker",
    modelValue: "modelValue"
  });
  dropdown: DropdownCI = creator<DropdownCI>({
    name: "el-dropdown",
    command(callback) {
      return {
        onCommand($event: any) {
          callback($event);
        }
      };
    },
    slotName: "dropdown",
    renderMode: "slot"
  });
  dropdownMenu: DropdownMenuCI = creator<DropdownMenuCI>({
    name: "el-dropdown-menu",
    command: () => {
      return {};
    }
  });
  dropdownItem: DropdownItemCI = creator<DropdownItemCI>({
    name: "el-dropdown-item",
    command: "command"
  });

  imageGroup: ImageGroupCI = creator<ImageGroupCI>({
    name: "fs-box"
  });
  image: ImageCI = creator<ImageCI>({
    name: "el-image",
    buildPreviewBind: ({ url, urls, previewUrl, previewUrls, index }) => {
      return { "preview-src-list": previewUrls, "initial-index": index };
    },
    fallback: "error"
  });
  progress: ProgressCI = creator<ProgressCI>({
    name: "el-progress"
  });
  loading: LoadingCI = creator<LoadingCI>({
    name: "loading",
    type: "directive"
  });
  upload: UploadCI = creator<UploadCI>({
    id: "uid",
    name: "el-upload",
    type: "",
    typeImageCard: "picture-card",
    typeImage: "picture",
    getStatusFromEvent(event) {
      return event?.status;
    },
    getFileListFromEvent(response: any, file: any, fileList: any) {
      return fileList;
    },
    status: {
      success: "success",
      uploading: "uploading"
    },
    isSuccess(fileItem) {
      return fileItem.status === "success";
    },
    limitAdd: 1
  });
  tabs: TabsCI = creator<TabsCI>({
    name: "el-tabs",
    modelValue: "modelValue",
    tabChange: "tabChange"
  });
  tabPane: TabPaneCI = creator<TabPaneCI>({
    name: "el-tab-pane",
    key: "name",
    tab: "label"
  });
  collapse: CollapseCI = creator<CollapseCI>({
    name: "el-collapse",
    modelValue: "modelValue",
    keyName: "name"
  });
  collapseItem: CollapseItemCI = creator<CollapseItemCI>({
    name: "el-collapse-item",
    key: "name",
    titleSlotName: "title",
    /**
     * element collapse只支持title插槽
     */
    extraSlotName: "not_support_extra",
    builder(opts) {
      return buildBinding(this, opts, {
        slots: {
          [this.titleSlotName]() {
            return (
              <div class={"fsel-collapse-item-title fsel-flex-row space-between"}>
                <span class={"title-text"}>{opts.titleSlot()} </span>
                <span class={"title-extra"}>{opts.extraSlot()}</span>
              </div>
            );
          }
        }
      });
    }
  });

  badge: BadgeCI = creator<BadgeCI>({
    name: "el-badge",
    value: "value",
    builder(opts) {
      return buildBinding(this, opts, {
        props: {
          [this.value]: opts.value
        }
      });
    }
  });
  tooltip: TooltipCI = creator<TooltipCI>({
    name: "el-tooltip",
    content: "content",
    trigger: "default"
  });
  divider: DividerCI = creator<DividerCI>({
    name: "el-divider"
  });
  popover: PopoverCI = creator<PopoverCI>({
    name: "el-popover",
    contentSlotName: "default",
    triggerSlotName: "reference",
    visible: "visible"
  });
}
