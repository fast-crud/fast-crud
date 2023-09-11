import {
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
  useUiRender,
  InputNumberCI,
  BadgeCI,
  CollapseTransitionCI,
  ButtonGroupCI,
  ColCI,
  RowCI,
  CardCI,
  TableScrollReq
} from "@fast-crud/ui-interface";
// @ts-ignore
import _ from "lodash-es";
import { ElDialog, useFormItem } from "element-plus";
import { ref } from "vue";

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
    eye: "View"
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
    value: "label",
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
    children: "tree.children"
  });

  radio: RadioCI = creator<RadioCI>({
    name: "el-radio",
    value: "label"
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
      const errorFields = e.code || e.validation || {};
      const errors: any = {};
      if (errorFields && errorFields instanceof Array) {
        for (const errorField of errorFields) {
          const name = errorField.field;
          errors[name] = true;
        }
      }

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
    }
  });

  button: ButtonCI = creator<ButtonCI>({
    name: "el-button",
    textType: { type: "text" },
    linkType: { type: "text" },
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
    buildSelectionBinding(req) {
      if (req.multiple) {
        const onSelectionChange = (changedRows: any[]) => {
          const rowKey = req.getRowKey();
          const selectedKeys = changedRows.map((item: any) => item[rowKey]);
          req.onSelectedKeysChanged(selectedKeys, true);
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
                columnSetDisabled: true //禁止在列设置中选择
              }
            }
          }
        };
      } else {
        //单选
        const onCurrentChange = (changed: any) => {
          const rowKey = req.getRowKey();
          const selectedKeys = [changed[rowKey]];
          req.onSelectedKeysChanged(selectedKeys, true);
        };
        return {
          table: {
            highlightCurrentRow: true,
            onCurrentChange: onCurrentChange
          }
        };
      }
    },
    rebuildRenderScope: (scope) => {
      return scope;
    },
    scrollTo(req: TableScrollReq) {
      req.tableRef.value.setScrollTop(req.top);
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
    modelValue: "modelValue"
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
