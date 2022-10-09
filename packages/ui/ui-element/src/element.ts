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
  PaginationCI
} from "@fast-crud/ui-interface";
import { DividerCI, FormCI, PopoverCI, TooltipCI } from "../../ui-interface/src/ui-interface";
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
    isComponent: false
  };

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
    question: "question-filled"
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
    value: "label",
    onChange(callback) {
      return {
        "onUpdate:modelValue": callback
      };
    }
  };

  drawer: DrawerCI = {
    name: "el-drawer",
    visible: "modelValue",
    customClass: "class",
    width: "size"
  };

  collapseTransition: CI = {
    name: "el-collapse-transition"
  };

  option: OptionCI = {
    name: "el-option",
    value: "value",
    label: "label"
  };

  select: SelectCI = {
    name: "el-select",
    modelValue: "modelValue",
    clearable: "clearable"
  };

  treeSelect: TreeSelectCI = {
    name: "el-tree-select",
    modelValue: "modelValue",
    clearable: "select.clearable",
    options: "data",
    value: "tree.value",
    label: "tree.label",
    children: "tree.children"
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
    clearable: "clearable",
    fieldNames(namesMap) {
      return {
        props: namesMap
      };
    }
  };

  form: FormCI = {
    name: "el-form",
    inlineLayout: {
      layout: "inline",
      inline: true
    },
    resetWrap: (formRef, { form, initialForm }) => {
      formRef.resetFields();
    },
    validateWrap: async formRef => {
      return formRef.validate();
    }
  };

  formItem: FormItemCI = {
    name: "el-form-item",
    prop: "prop",
    label: "label",
    rules: "rules"
  };

  button: ButtonCI = {
    name: "el-button",
    textType: { type: "text" },
    linkType: { type: "text" },
    circle: { circle: true },
    colors: type => {
      return { type };
    }
  };

  pagination: PaginationCI = {
    name: "el-pagination",
    currentPage: "currentPage",
    total: "total", //总条数
    pageCount: null,
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
    renderMode: "slot",
    defaultRowKey: "id",
    fixedHeaderNeedComputeBodyHeight: false,
    buildMaxHeight: maxHeight => {
      return { maxHeight };
    },
    hasMaxHeight: options => {
      return options?.maxHeight != null;
    },
    headerDomSelector: "",
    vLoading: "loading",
    onChange({ onSortChange, onFilterChange }) {
      return {
        onSortChange: ({ column, prop, order }) => {
          if (!onSortChange) {
            return;
          }
          onSortChange({
            isServerSort: prop && column.sortable === "custom",
            prop,
            order,
            asc: order === "ascending"
          });
        },
        onFilterChange
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
    passwordType: { showPassword: true }
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
    slotName: "dropdown",
    renderMode: "slot"
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
    typeImageCard: "picture-card",
    typeImage: "picture",
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
  tooltip: TooltipCI = {
    name: "el-tooltip",
    content: "content",
    trigger: "default"
  };
  divider: DividerCI = {
    name: "el-divider"
  };
  popover: PopoverCI = {
    name: "el-popover",
    contentSlotName: "default",
    referenceSlotName: "reference",
    visible: "visible"
  };
}
