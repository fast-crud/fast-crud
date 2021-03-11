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
} from "./ui-interface";
export class Element implements UiInterface {
  constructor(target) {
    if (target) {
      this.notification.get = target.Notification;
      this.message.get = target.Message;
      this.messageBox.get = target.MessageBox;
    }
  }

  type = "element";
  modelValue = "modelValue";

  switch: SwitchCI = {
    activeColor: "active-color",
    activeText: "active-text",
    activeValue: "active-value",
    inactiveColor: "inactive-color",
    inactiveText: "inactive-text",
    inactiveValue: "inactive-value",
    modelValue: "modelValue",
    name: "el-switch",
  };

  formWrapper: FormWrapperCI = {
    visible: "modelValue",
    customClass: "customClass",
    buildOnClosedBind(is: string, onClosed: Function) {
      return { onClosed };
    },
    name: "fs-form-wrapper",
  };

  messageBox: MessageBoxCI = {
    name: "el-message-box",
    get: undefined,
    open: async (context) => {
      return this.messageBox.get(context);
    },
    confirm: async (context) => {
      return this.messageBox.get(context);
    },
  };

  message: MessageCI = {
    get: undefined,
    name: "el-message",
    open: (context) => {
      this.message.get.open(context);
    },
    success: (msg) => {
      this.message.get.success(msg);
    },
    error: (msg) => {
      this.message.get.error(msg);
    },
    warn: (msg) => {
      this.message.get.warn(msg);
    },
    info: (msg) => {
      this.message.get.success(msg);
    },
  };

  notification: NotificationCI = {
    get: undefined,
    name: "el-notification",
    open: (context) => {
      this.notification.get.open(context);
    },
    success: (msg) => {
      this.notification.get.success(msg);
    },
    error: (msg) => {
      this.notification.get.error(msg);
    },
    warn: (msg) => {
      this.notification.get.warn(msg);
    },
    info: (msg) => {
      this.notification.get.success(msg);
    },
  };

  icon: IconCI = {
    name: "",
    isComponent: false,
    circle: { circle: true },
  };

  icons: Icons = {
    add: "el-icon-plus",
    columnsFilter: "el-icon-set-up",
    compact: "el-icon-rank",
    edit: "el-icon-edit",
    remove: "el-icon-remove",
    search: "el-icon-search",
    refresh: "el-icon-refresh",
    export: "el-icon-upload2",
    check: "el-icon-check",
    sort: "el-icon-sort",
    left: "el-icon-arrow-left",
    right: "el-icon-arrow-right",
    close: "el-icon-close",
    arrowLeft: "el-icon-left",
    arrowRight: "el-icon-right",
    more: "el-icon-more",
  };

  dialog: DialogCI = {
    name: "el-dialog",
    visible: "modelValue",
    footer() {
      return {};
    },
  };

  buttonGroup: CI = {
    name: "el-button-group",
  };

  col: CI = {
    name: "el-col",
  };

  row: CI = {
    name: "el-row",
  };

  card: CI = {
    name: "el-card",
  };

  checkboxGroup: CheckboxGroupCI = {
    name: "el-checkbox-group",
    modelValue: "modelValue",
  };
  checkbox: CheckboxCI = {
    name: "el-checkbox",
    resolveEvent(e) {
      return e;
    },
    value: "label",
  };

  drawer: DrawerCI = {
    name: "el-drawer",
    visible: "modelValue",
    customClass: "custom-class",
    width: "size",
  };

  collapseTransition: CI = {
    name: "el-collapse-transition",
  };

  option: CI = {
    name: "el-option",
  };

  select: SelectCI = {
    name: "el-select",
    modelValue: "modelValue",
    clearable: "clearable",
  };

  radio: RadioCI = {
    name: "el-radio",
    value: "label",
  };

  radioGroup: RadioGroupCI = {
    name: "el-radio-group",
    modelValue: "modelValue",
  };

  cascader: CascaderCI = {
    name: "el-cascader",
    modelValue: "modelValue",
    clearable: "clearable",
  };

  form: CI = {
    name: "el-form",
  };

  formItem: FormItemCI = {
    name: "el-form-item",
    prop: "prop",
    label: "label",
  };

  button: CI = {
    name: "el-button",
  };

  pagination: CI = {
    name: "el-pagination",
  };

  tableColumn: TableColumnCI = {
    name: "el-table-column",
    label: "label",
    prop: "prop",
    row: "row",
    index: "$index",
  };

  tableColumnGroup: TableColumnCI = {
    name: "el-table-column",
    label: "label",
    prop: "prop",
    row: "row",
    index: "$index",
  };

  table: TableCI = {
    name: "el-table",
    data: "data",
    fixedHeaderNeedComputeBodyHeight: false,
    vLoading: "loading",
  };

  textArea: TextAreaCI = {
    name: "el-input",
    type: "textarea",
    modelValue: "modelValue",
    clearable: "clearable",
  };

  tag: TagCI = {
    name: "el-tag",
    type: "type",
    colors: ["primary", "success", "warning", "danger"],
  };

  inputGroup: InputGroupCI = {
    name: "el-input-group",
  };
  input: InputCI = {
    name: "el-input",
    clearable: "clearable",
    modelValue: "modelValue",
  };
  inputPassword: InputPasswordCI = {
    name: "el-input",
    clearable: "clearable",
    modelValue: "modelValue",
    showPassword: "showPassword",
  };
  number: CI = {
    name: "el-input-number",
  };
  datePicker: DatePickerCI = {
    name: "el-date-picker",
    modelValue: "modelValue",
    buildDateType(type) {
      return { type };
    },
  };
  timePicker: TimePickerCI = {
    name: "el-time-picker",
    modelValue: "modelValue",
  };
  dropdown: DropdownCI = {
    name: "el-dropdown",
    command(callback) {
      return {
        onCommand($event) {
          callback($event);
        },
      };
    },
    slotName: "dropdown",
  };
  dropdownMenu: DropdownMenuCI = {
    name: "el-dropdown-menu",
    command: () => {
      return {};
    },
  };
  dropdownItem: DropdownItemCI = {
    name: "el-dropdown-item",
    command: "command",
  };
}
