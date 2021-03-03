import {
  CheckboxCI,
  CI,
  DialogCI,
  DrawerCI,
  FormItemCI,
  FormWrapperCI,
  IconCI,
  Icons,
  InputCI,
  MessageBoxCI,
  MessageCI,
  NotificationCI,
  SelectCI,
  TableCI,
  TableColumnCI,
  TextAreaCI,
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
          afterVisibleChange: (visiable) => {
            if (visiable === false) {
              onClosed(visiable);
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

  checkbox: CheckboxCI = {
    name: "a-checkbox",
    resolveEvent(e) {
      return e.target.checked;
    },
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

  radio: CI = {
    name: "a-radio",
  };

  radioGroup: CI = {
    name: "a-radio-group",
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

  tag: CI = {
    name: "a-tag",
  };

  input: InputCI = {
    name: "a-input",
    clearable: "allowClear",
    modelValue: "value",
  };
}
