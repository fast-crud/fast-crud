import {
  CascaderCI,
  CheckboxCI,
  CheckboxGroupCI,
  CI,
  DatePickerCI,
  DialogCI,
  DrawerCI,
  FormItemCI,
  FormWrapperCI,
  IconCI,
  Icons,
  InputCI,
  InputGroupCI,
  InputPasswordCI,
  MessageBoxCI,
  MessageCI,
  NotificationCI,
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
} from "./ui-interface";
export class Antdv implements UiInterface {
  constructor(target) {
    this.notification.get = target.Notification;
    this.message.get = target.Message;
    this.messageBox.get = target.MessageBox;
  }

  type = "antdv";
  modelValue = "value";

  formWrapper: FormWrapperCI = {
    visible: "visible",
    customClass: "wrapClassName",
    buildOnClosedBind(is, onClosed: Function): {} {
      if (is === "a-modal") {
        return { afterClose: onClosed };
      } else if (is === "a-drawer") {
        return {
          afterVisibleChange: (visible) => {
            if (visible === false) {
              onClosed(visible);
            }
          },
        };
      }
      return {};
    },
    name: "fs-form-wrapper",
  };

  messageBox: MessageBoxCI = {
    name: "a-model",
    get: undefined,
    open: (context) => {
      return this.messageBox.confirm(context);
    },
    confirm: (context) => {
      return new Promise((resolve, reject) => {
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
          onCancel,
        };
        this.messageBox.get.confirm(newContext);
      });
    },
  };

  message: MessageCI = {
    get: undefined,
    name: "a-message",
    open: (type, context) => {
      if (typeof context === "string") {
        context = {
          message: context,
        };
      }
      type = type || context.type;
      if (type) {
        this.message.get[type](context);
      } else {
        this.message.get.open(context);
      }
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
    },
  };

  notification: NotificationCI = {
    get: undefined,
    name: "a-notification",
    open: (type, context) => {
      if (typeof context === "string") {
        context = {
          message: context,
        };
      }
      type = type || context.type;
      if (type) {
        this.notification.get[type](context);
      } else {
        this.notification.get.open(context);
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
    },
  };

  icon: IconCI = {
    name: "",
    isComponent: true,
    circle: { shape: "circle" },
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
  };

  dialog: DialogCI = {
    name: "a-modal",
    visible: "visible",
    footer() {
      return { footer: null };
    },
  };

  button: CI = {
    name: "a-button",
  };

  buttonGroup: CI = {
    name: "a-button-group",
  };

  card: CI = {
    name: "a-card",
  };

  cascader: CascaderCI = {
    name: "a-cascader",
    modelValue: "value",
    clearable: "allowClear",
  };

  checkboxGroup: CheckboxGroupCI = {
    name: "a-checkbox-group",
    modelValue: "value",
  };
  checkbox: CheckboxCI = {
    name: "a-checkbox",
    resolveEvent(e) {
      return e.target.checked;
    },
    value: "value",
  };

  col: CI = {
    name: "a-col",
  };

  collapseTransition: CI = {
    name: "div",
  };

  drawer: DrawerCI = {
    name: "a-drawer",
    visible: "visible",
    customClass: "wrapClassName",
    width: "width",
  };

  form: CI = {
    name: "a-form",
  };

  formItem: FormItemCI = {
    name: "a-form-item",
    prop: "name",
    label: "label",
  };

  option: CI = {
    name: "a-select-option",
  };

  pagination: CI = {
    name: "a-pagination",
  };

  radio: RadioCI = {
    name: "a-radio",
    value: "value",
  };

  radioGroup: RadioGroupCI = {
    name: "a-radio-group",
    modelValue: "value",
  };

  row: CI = {
    name: "a-row",
  };

  select: SelectCI = {
    name: "a-select",
    modelValue: "value",
    clearable: "allowClear",
  };

  table: TableCI = {
    name: "a-table",
    data: "data-source",
    fixedHeaderNeedComputeBodyHeight: true,
    vLoading: false,
  };

  tableColumn: TableColumnCI = {
    name: "a-table-column",
    label: "title",
    prop: "key",
    row: "record",
    index: "index",
  };

  tableColumnGroup: TableColumnCI = {
    name: "a-table-column-group",
    label: "title",
    prop: "key",
    row: "record",
    index: "index",
  };

  textArea: TextAreaCI = {
    name: "a-textarea",
    type: undefined,
    modelValue: "value",
    clearable: "allowClear",
  };

  tag: TagCI = {
    name: "a-tag",
    type: "color",
    colors: ["blue", "green", "orange", "red", "cyan", "purple"],
  };

  inputGroup: InputGroupCI = {
    name: "a-input",
  };
  input: InputCI = {
    name: "a-input",
    clearable: "allowClear",
    modelValue: "value",
  };
  inputPassword: InputPasswordCI = {
    name: "a-input-password",
    clearable: "allowClear",
    modelValue: "value",
    showPassword: "showPassword",
  };
  number: CI = {
    name: "a-input-number",
  };
  switch: SwitchCI = {
    activeColor: "active-color",
    activeText: "checkedChildren",
    activeValue: "active-value",
    inactiveColor: "inactive-color",
    inactiveText: "unCheckedChildren",
    inactiveValue: "inactive-value",
    modelValue: "checked",
    name: "a-switch",
  };
  datePicker: DatePickerCI = {
    name: "a-date-picker",
    modelValue: "value",
    buildDateType(type) {
      if (type === "date") {
        return { name: "a-date-picker" };
      }
      // year/month/date/week/datetime/datetimerange/daterange
      if (type === "datetime") {
        return { name: "a-date-picker", showTime: true };
      }
      if (type === "daterange") {
        return { name: "a-range-picker" };
      }
      if (type === "datetimerange") {
        return { name: "a-range-picker", showTime: true };
      }
      if (type === "month") {
        return { name: "a-month-picker" };
      }
      if (type === "week") {
        return { name: "a-week-picker" };
      }
      return { name: "a-date-picker" };
    },
  };
  timePicker: TimePickerCI = {
    name: "a-time-picker",
    modelValue: "value",
  };
}
