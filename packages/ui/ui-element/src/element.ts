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
  PaginationCI
} from "@fast-crud/fast-crud";
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
    name: "el-switch"
  };

  formWrapper: FormWrapperCI = {
    visible: "modelValue",
    customClass: "customClass",
    buildOnClosedBind(is: string, onClosed: Function) {
      return { onClosed };
    },
    name: "fs-form-wrapper"
  };

  messageBox: MessageBoxCI = {
    name: "el-message-box",
    get: undefined,
    open: async context => {
      return this.messageBox.get(context);
    },
    confirm: async context => {
      return this.messageBox.get(context);
    }
  };

  message: MessageCI = {
    get: undefined,
    name: "el-message",
    open: context => {
      this.message.get.open(context);
    },
    success: msg => {
      this.message.get.success(msg);
    },
    error: msg => {
      this.message.get.error(msg);
    },
    warn: msg => {
      this.message.get.warning(msg);
    },
    info: msg => {
      this.message.get(msg);
    }
  };

  notification: NotificationCI = {
    get: undefined,
    name: "el-notification",
    open: context => {
      this.notification.get.open(context);
    },
    success: msg => {
      this.notification.get.success(msg);
    },
    error: msg => {
      this.notification.get.error(msg);
    },
    warn: msg => {
      this.notification.get.warn(msg);
    },
    info: msg => {
      this.notification.get.success(msg);
    }
  };

  icon: IconCI = {
    name: "",
    isComponent: false,
    circle: { circle: true }
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
    plus: "el-icon-plus",
    zoomIn: "el-icon-zoom-in",
    zoomOut: "el-icon-zoom-out",
    refreshLeft: "el-icon-refresh-left",
    refreshRight: "el-icon-refresh-right",
    upload: "el-icon-upload",
    fullScreen: "el-icon-full-screen",
    unFullScreen: "el-icon-full-screen"
  };

  dialog: DialogCI = {
    name: "el-dialog",
    visible: "modelValue",
    customClass: "customClass",
    buildOnClosedBind(onClosed) {
      return { onClosed };
    },
    footer() {
      return {};
    }
  };

  buttonGroup: CI = {
    name: "el-button-group"
  };

  col: CI = {
    name: "el-col"
  };

  row: CI = {
    name: "el-row"
  };

  card: CI = {
    name: "el-card"
  };

  checkboxGroup: CheckboxGroupCI = {
    name: "el-checkbox-group",
    modelValue: "modelValue"
  };
  checkbox: CheckboxCI = {
    name: "el-checkbox",
    resolveEvent(e) {
      return e;
    },
    modelValue: "modelValue",
    value: "label"
  };

  drawer: DrawerCI = {
    name: "el-drawer",
    visible: "modelValue",
    customClass: "custom-class",
    width: "size"
  };

  collapseTransition: CI = {
    name: "el-collapse-transition"
  };

  option: CI = {
    name: "el-option"
  };

  select: SelectCI = {
    name: "el-select",
    modelValue: "modelValue",
    clearable: "clearable"
  };

  treeSelect: TreeSelectCI = {
    name: "el-tree-select",
    modelValue: "value",
    clearable: "clearable"
  };

  radio: RadioCI = {
    name: "el-radio",
    value: "label"
  };

  radioGroup: RadioGroupCI = {
    name: "el-radio-group",
    modelValue: "modelValue"
  };

  cascader: CascaderCI = {
    name: "el-cascader",
    modelValue: "modelValue",
    clearable: "clearable"
  };

  form: CI = {
    name: "el-form"
  };

  formItem: FormItemCI = {
    name: "el-form-item",
    prop: "prop",
    label: "label"
  };

  button: ButtonCI = {
    name: "el-button",
    text: "text"
  };

  pagination: PaginationCI = {
    name: "el-pagination",
    currentPage: "currentPage",
    onChange({ setCurrentPage, setPageSize, doAfterChange }) {
      return {
        // element 页码改动回调
        onCurrentChange(event) {
          setCurrentPage(event);
          doAfterChange();
        },
        onSizeChange(event) {
          setPageSize(event);
          doAfterChange();
        }
      };
    }
  };

  tableColumn: TableColumnCI = {
    name: "el-table-column",
    label: "label",
    prop: "prop",
    row: "row",
    index: "$index"
  };

  tableColumnGroup: TableColumnCI = {
    name: "el-table-column",
    label: "label",
    prop: "prop",
    row: "row",
    index: "$index"
  };

  table: TableCI = {
    name: "el-table",
    data: "data",
    fixedHeaderNeedComputeBodyHeight: false,
    vLoading: "loading",
    onSortChange({ emit }) {
      return {
        onSortChange({ column, prop, order }) {
          console.log("sort change", column, prop, order);
          emit({
            isServerSort: prop && column.sortable === "custom",
            prop,
            order,
            asc: order === "ascending"
          });
        }
      };
    }
  };

  textArea: TextAreaCI = {
    name: "el-input",
    type: "textarea",
    modelValue: "modelValue",
    clearable: "clearable"
  };

  tag: TagCI = {
    name: "el-tag",
    type: "type",
    colors: ["primary", "success", "warning", "danger"]
  };

  inputGroup: InputGroupCI = {
    name: "el-input-group"
  };
  input: InputCI = {
    name: "el-input",
    clearable: "clearable",
    modelValue: "modelValue"
  };
  inputPassword: InputPasswordCI = {
    name: "el-input",
    clearable: "clearable",
    modelValue: "modelValue",
    showPassword: "showPassword"
  };
  number: CI = {
    name: "el-input-number"
  };
  datePicker: DatePickerCI = {
    name: "el-date-picker",
    modelValue: "modelValue",
    buildDateType(type) {
      return { name: "el-date-picker", type };
    }
  };
  timePicker: TimePickerCI = {
    name: "el-time-picker",
    modelValue: "modelValue"
  };
  dropdown: DropdownCI = {
    name: "el-dropdown",
    command(callback) {
      return {
        onCommand($event) {
          callback($event);
        }
      };
    },
    slotName: "dropdown"
  };
  dropdownMenu: DropdownMenuCI = {
    name: "el-dropdown-menu",
    command: () => {
      return {};
    }
  };
  dropdownItem: DropdownItemCI = {
    name: "el-dropdown-item",
    command: "command"
  };

  imageGroup: ImageGroupCI = {
    name: "fs-box"
  };
  image: ImageCI = {
    name: "el-image",
    buildPreviewList: urls => {
      return { "preview-src-list": urls };
    }
  };
  progress: ProgressCI = {
    name: "el-progress"
  };
  loading: LoadingCI = {
    name: "v-loading",
    type: "directive"
  };
  upload: UploadCI = {
    name: "el-upload",
    type: "",
    getStatusFromEvent(event) {
      return event?.status;
    },
    getFileListFromEvent(response, file, fileList) {
      return fileList;
    },
    status: {
      success: "success",
      uploading: "uploading"
    },
    limitAdd: 1
  };
  tabs: TabsCI = {
    name: "el-tabs"
  };
  tabPane: TabPaneCI = {
    name: "el-tab-pane"
  };
  collapse: CollapseCI = {
    name: "el-collapse",
    modelValue: "modelValue",
    keyName: "name"
  };
  collapseItem: CollapseItemCI = {
    name: "el-collapse-item"
  };
}
