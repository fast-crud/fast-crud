import {
  CascaderCI,
  CheckboxCI,
  CheckboxGroupCI,
  CI,
  DatePickerCI,
  DialogCI,
  DrawerCI,
  DropdownCI,
  DropdownItemCI,
  DropdownMenuCI,
  FormItemCI,
  FormWrapperCI,
  IconCI,
  Icons,
  ImageCI,
  ImageGroupCI,
  InputCI,
  InputGroupCI,
  InputPasswordCI,
  LoadingCI,
  MessageBoxCI,
  MessageCI,
  NotificationCI,
  ProgressCI,
  RadioCI,
  RadioGroupCI,
  SelectCI,
  SwitchCI,
  TableCI,
  TableColumnCI,
  TagCI,
  TextAreaCI,
  TimePickerCI,
  UiInterface,
  UploadCI,
  TreeSelectCI,
  TabsCI,
  TabPaneCI,
  CollapseCI,
  CollapseItemCI,
  ButtonCI,
  PaginationCI
} from "@fast-crud/ui-interface";
import { FormCI, TooltipCI } from "../../ui-interface/src/ui-interface";

export class Naive implements UiInterface {
  constructor(target) {
    if (target) {
      this.init(target);
    }
  }

  init({ notification, message, messageBox }) {
    this.notification.instance = notification;
    this.message.instance = message;
    this.messageBox.instance = messageBox;
  }

  type = "naive";
  modelValue = "modelValue";

  formWrapper: FormWrapperCI = {
    visible: "visible",
    customClass: "wrapClassName",
    buildOnClosedBind(is, onClosed: Function): {} {
      if (is === "n-modal") {
        return { afterClose: onClosed };
      } else if (is === "n-drawer") {
        return {
          afterVisibleChange: (visible) => {
            if (visible === false) {
              onClosed(visible);
            }
          }
        };
      }
      return {};
    },
    name: "fs-form-wrapper"
  };

  messageBox: MessageBoxCI = {
    name: "n-dialog",
    instance: undefined,
    get() {
      if (!this.instance) {
        throw new Error("请先在app.vue中执行ui初始化(naiveUi.init())");
      }
      if (this.instance instanceof Function) {
        return this.instance();
      } else {
        return this.instance;
      }
    },
    open: (context) => {
      return this.messageBox.confirm(context);
    },
    confirm: (context) => {
      return new Promise<void>((resolve, reject) => {
        function onOk() {
          resolve();
        }

        // eslint-disable-next-line @typescript-eslint/no-empty-function
        function onCancel() {
          reject(new Error("cancel"));
        }

        const newContext = {
          ...context,
          content: context.message,
          onOk,
          onCancel
        };
        this.messageBox.get().confirm(newContext);
      });
    }
  };

  message: MessageCI = {
    instance: undefined,
    get() {
      if (!this.instance) {
        throw new Error("请先在app.vue中执行ui初始化");
      }
      if (this.instance instanceof Function) {
        return this.instance();
      } else {
        return this.instance;
      }
    },
    name: "n-message",
    open: (type, context) => {
      let content = context;
      if (typeof context !== "string") {
        content = context.message || context.content;
      }
      this.message.get()[type](content);
    },
    success: (context) => {
      this.message.open("success", context);
    },
    error: (context) => {
      this.message.open("error", context);
    },
    warn: (context) => {
      this.message.open("warn", context);
    },
    info: (context) => {
      this.message.open("info", context);
    }
  };

  notification: NotificationCI = {
    instance: undefined,
    name: "n-notification",
    get() {
      if (!this.instance) {
        throw new Error("请先配置ui");
      }
      if (this.instance instanceof Function) {
        return this.instance();
      } else {
        return this.instance;
      }
    },
    open: (type, context) => {
      if (typeof context === "string") {
        context = {
          message: context
        };
      }
      type = type || context.type;
      if (type) {
        this.notification.get()[type](context);
      } else {
        this.notification.get().open(context);
      }
    },
    success: (context) => {
      this.notification.open("success", context);
    },
    error: (context) => {
      this.notification.open("error", context);
    },
    warn: (context) => {
      this.notification.open("warn", context);
    },
    info: (context) => {
      this.notification.open("info", context);
    }
  };

  icon: IconCI = {
    name: "",
    isComponent: true,
    circle: { shape: "circle" }
  };

  icons: Icons = {
    add: "PlusOutlined",
    columnsFilter: "ControlOutlined",
    compact: "DragOutlined",
    edit: "EditOutlined",
    export: "UploadOutlined",
    refresh: "SyncOutlined",
    remove: "DeleteOutlined",
    search: "SearchOutlined",
    check: "CheckOutlined",
    sort: "DragOutlined",
    close: "CloseOutlined",
    arrowRight: "ArrowRightOutlined",
    arrowLeft: "ArrowLeftOutlined",
    left: "LeftOutlined",
    right: "RightOutlined",
    more: "EllipsisOutlined",
    plus: "PlusOutlined",
    zoomIn: "ZoomInOutlined",
    zoomOut: "ZoomOutOutlined",
    refreshLeft: "UndoOutlined",
    refreshRight: "RedoOutlined",
    upload: "UploadOutlined",
    fullScreen: "CompressOutlined",
    unFullScreen: "ExpandOutlined",
    question: "QuestionCircleOutlined"
  };

  dialog: DialogCI = {
    name: "n-modal",
    visible: "visible",
    customClass: "wrapClassName",
    footer(footer = null) {
      return { footer };
    },
    buildOnClosedBind(onClosed: Function): {} {
      return { afterClose: onClosed };
    }
  };

  button: ButtonCI = {
    name: "n-button",
    textType: { text: true },
    circle: { circle: true },
    colors: (type) => {
      if (type === "danger") {
        return { danger: true };
      }
      if (type === "info" || type === "warning") {
        return { type: "default" };
      }
      return { type };
    }
  };

  buttonGroup: CI = {
    name: "n-button-group"
  };

  card: CI = {
    name: "n-card"
  };

  cascader: CascaderCI = {
    name: "n-cascader",
    modelValue: "value",
    clearable: "allowClear",
    fieldNames(namesMap) {
      return { fieldNames: namesMap };
    }
  };

  checkboxGroup: CheckboxGroupCI = {
    name: "n-checkbox-group",
    modelValue: "value"
  };
  checkbox: CheckboxCI = {
    name: "n-checkbox",
    resolveEvent(e) {
      return e.target.checked;
    },
    value: "value",
    modelValue: "checked"
  };

  col: CI = {
    name: "n-col"
  };

  collapseTransition: CI = {
    name: "div"
  };

  drawer: DrawerCI = {
    name: "n-drawer",
    visible: "visible",
    customClass: "wrapClassName",
    width: "width"
  };

  form: FormCI = {
    name: "n-form",
    inlineLayout: {
      inline: true,
      labelPlacement: "left"
    },
    validateWrap: async (formRef) => {
      return new Promise((resolve, reject) => {
        formRef.validate((errors: Array<any>) => {
          if (!errors || errors.length === 0) {
            resolve(true);
          } else {
            reject(errors);
          }
        });
      });
    }
  };

  formItem: FormItemCI = {
    name: "n-form-item",
    prop: "name",
    label: "label"
  };

  option: CI = {
    name: "n-select-option"
  };

  pagination: PaginationCI = {
    name: "n-pagination",
    currentPage: "page",
    total: "itemCount",
    pageCount: "pageCount",
    onChange({ setCurrentPage, setPageSize, doAfterChange }) {
      return {
        // antd 页码改动回调
        "onUpdate:page": (page) => {
          console.log("update page", page);
          setCurrentPage(page);
          doAfterChange();
        },
        "onUpdate:pageSize": (pageSize) => {
          console.log("update page size", pageSize);
          setPageSize(pageSize);
          doAfterChange();
        }
      };
    }
  };

  radio: RadioCI = {
    name: "n-radio",
    value: "value"
  };

  radioGroup: RadioGroupCI = {
    name: "n-radio-group",
    modelValue: "value"
  };

  row: CI = {
    name: "n-row"
  };

  select: SelectCI = {
    name: "n-select",
    modelValue: "value",
    clearable: "allowClear"
  };

  treeSelect: TreeSelectCI = {
    name: "n-tree-select",
    modelValue: "value",
    clearable: "allowClear"
  };
  table: TableCI = {
    name: "n-data-table",
    renderMode: "config",
    data: "data",
    defaultRowKey: (rowData) => {
      return rowData.id;
    },
    fixedHeaderNeedComputeBodyHeight: true,
    vLoading: false,
    onChange({ onSortChange, onFilterChange, onPagination }) {
      return {
        onChange: (pagination, filters, sorter, { currentDataSource }) => {
          if (pagination && onPagination) {
            onPagination({ ...pagination, data: currentDataSource });
          }
          if (filters && onFilterChange) {
            onFilterChange({ ...filters, data: currentDataSource });
          }
          if (sorter && onSortChange) {
            const { column, field, order } = sorter;
            onSortChange({
              isServerSort: order && column.sorter === true,
              prop: field,
              order,
              asc: order === "ascend"
            });
          }
        }
      };
    }
  };

  tableColumn: TableColumnCI = {
    name: "n-table-column",
    label: "title",
    prop: "key",
    row: "row",
    index: "index"
  };

  tableColumnGroup: TableColumnCI = {
    name: "n-table-column-group",
    label: "title",
    prop: "key",
    row: "record",
    index: "index"
  };

  textArea: TextAreaCI = {
    name: "n-textarea",
    type: undefined,
    modelValue: "value",
    clearable: "allowClear"
  };

  tag: TagCI = {
    name: "n-tag",
    type: "color",
    colors: ["blue", "green", "orange", "red", "cyan", "purple"]
  };

  inputGroup: InputGroupCI = {
    name: "n-input"
  };
  input: InputCI = {
    name: "n-input",
    clearable: "allowClear",
    modelValue: "value"
  };
  inputPassword: InputPasswordCI = {
    name: "n-input-password",
    clearable: "allowClear",
    modelValue: "value",
    showPassword: "showPassword"
  };
  number: CI = {
    name: "n-input-number"
  };
  switch: SwitchCI = {
    activeColor: "active-color",
    activeText: "checkedChildren",
    activeValue: "active-value",
    inactiveColor: "inactive-color",
    inactiveText: "unCheckedChildren",
    inactiveValue: "inactive-value",
    modelValue: "checked",
    name: "n-switch"
  };
  datePicker: DatePickerCI = {
    name: "n-date-picker",
    modelValue: "value",
    buildDateType(type) {
      if (type === "date") {
        return { name: "n-date-picker" };
      }
      // year/month/date/week/datetime/datetimerange/daterange
      if (type === "datetime") {
        return { name: "n-date-picker", showTime: true };
      }
      if (type === "daterange") {
        return { name: "n-range-picker" };
      }
      if (type === "datetimerange") {
        return { name: "n-range-picker", showTime: true };
      }
      if (type === "month") {
        return { name: "n-month-picker" };
      }
      if (type === "week") {
        return { name: "n-week-picker" };
      }
      return { name: "n-date-picker" };
    }
  };
  timePicker: TimePickerCI = {
    name: "n-time-picker",
    modelValue: "value"
  };
  dropdown: DropdownCI = {
    name: "n-dropdown",
    command: () => {
      return {};
    },
    slotName: "overlay"
  };
  dropdownMenu: DropdownMenuCI = {
    name: "n-menu",
    command: (callback) => {
      return {
        onClick($event) {
          callback($event.key);
        }
      };
    }
  };
  dropdownItem: DropdownItemCI = {
    name: "n-menu-item",
    command: "key"
  };
  imageGroup: ImageGroupCI = {
    name: "n-image-preview-group"
  };
  image: ImageCI = {
    name: "n-image",
    buildPreviewList: () => {
      return {};
    }
  };
  progress: ProgressCI = {
    name: "n-progress"
  };
  loading: LoadingCI = {
    name: "n-spin",
    type: "component"
  };
  upload: UploadCI = {
    name: "n-upload",
    type: "",
    getStatusFromEvent(event) {
      return event?.file?.status;
    },
    getFileListFromEvent(event) {
      return event?.fileList;
    },
    status: {
      success: "done",
      uploading: "uploading"
    },
    limitAdd: 0
  };
  tabs: TabsCI = {
    name: "n-tabs"
  };
  tabPane: TabPaneCI = {
    name: "n-tab-pane"
  };
  collapse: CollapseCI = {
    name: "n-collapse",
    modelValue: "activeKey",
    keyName: "key"
  };
  collapseItem: CollapseItemCI = {
    name: "n-collapse-panel"
  };
  tooltip: TooltipCI = {
    name: "n-tooltip",
    content: "title"
  };
}
