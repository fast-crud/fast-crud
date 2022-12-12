import _ from "lodash-es";
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
  PaginationCI,
  FormCI,
  TooltipCI,
  OptionCI,
  DividerCI,
  PopoverCI
} from "@fast-crud/ui-interface";

export class Naive implements UiInterface {
  constructor(target) {
    if (target) {
      this.init(target);
    }
  }

  init({ notification, message, messageBox, i18n }) {
    this.notification.instance = notification;
    this.message.instance = message;
    this.messageBox.instance = messageBox;
  }

  type = "naive";
  modelValue = "value";
  i18n = null;

  formWrapper: FormWrapperCI = {
    visible: "show",
    customClass: "class",
    titleSlotName: "header",
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
    buildWidthBind(is, width) {
      return { style: { width: width } };
    },
    buildInitBind(is) {
      return { preset: "card" };
    },
    buildInnerBind({ getInnerWrapper }) {
      return { to: getInnerWrapper() };
    },
    hasContentWrap(is) {
      if (is === "n-drawer") {
        return "n-drawer-content";
      }
    },
    name: "fs-form-wrapper"
  };

  messageBox: MessageBoxCI = {
    name: "n-dialog",
    instance: undefined,
    getInstance() {
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
      return this.messageBox.getInstance().info(context);
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
          content: context.message,
          title: "请确认",
          negativeText: "取消",
          positiveText: "确定",
          onPositiveClick: onOk,
          onNegativeClick: onCancel,
          ...context
        };
        this.messageBox.open(newContext);
      });
    }
  };

  message: MessageCI = {
    instance: undefined,
    getInstance() {
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
      this.message.getInstance()[type](content);
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
    getInstance() {
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
          title: context
        };
      }
      context = Object.assign({ duration: 5000 }, context);
      type = type || context.type;
      if (type) {
        this.notification.getInstance()[type](context);
      } else {
        this.notification.getInstance().open(context);
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
    visible: "show",
    customClass: "class",
    titleSlotName: "header",
    footer(footer = null) {
      return { footer };
    },
    buildOnClosedBind(onClosed: Function): {} {
      return { afterClose: onClosed };
    },
    buildWidthBind(width) {
      return { style: { width: width } };
    },
    buildInitBind() {
      return { preset: "card" };
    }
  };

  button: ButtonCI = {
    name: "n-button",
    textType: { type: "text", quaternary: true },
    linkType: { type: "text", quaternary: true, tag: "a", vModel: "text", target: "_blank", textColor: "#2080f0" },
    circle: { circle: true },
    colors: (type) => {
      if (type === "danger") {
        return { type: "error" };
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
    clearable: "clearable",
    fieldNames(namesMap) {
      /**
             * label-field="whateverLabel"
             value-field="whateverValue"
             children-field="whateverChildren"
             */
      return { labelField: namesMap.label, valueField: namesMap.value, childrenField: namesMap.children };
    }
  };

  checkboxGroup: CheckboxGroupCI = {
    name: "n-checkbox-group",
    modelValue: "value"
  };
  checkbox: CheckboxCI = {
    name: "n-checkbox",
    resolveEvent(e) {
      return e;
    },
    value: "value",
    modelValue: "checked",
    onChange(callback) {
      return {
        "onUpdate:checked": callback
      };
    }
  };

  col: CI = {
    name: "n-col"
  };

  collapseTransition: CI = {
    name: "div"
  };

  drawer: DrawerCI = {
    name: "n-drawer",
    visible: "show",
    customClass: "class",
    width: "width",
    hasContentWrap: "n-drawer-content"
  };

  form: FormCI = {
    name: "n-form",
    inlineLayout: {
      inline: true,
      labelPlacement: "left"
    },
    resetWrap: (formRef, { form, initialForm }) => {
      const entries = _.entries(form);
      for (const entry of entries) {
        const initialValue = _.get(initialForm, entry[0]);
        if (initialValue == null) {
          _.unset(form, entry[0]);
        } else {
          _.set(form, entry[0], entry[1]);
        }
      }
      // const keys = Object.keys(form);
      // for (const key of keys) {
      //   if (initialForm[key] != null) {
      //     form[key] = initialForm[key];
      //   } else {
      //     delete form[key];
      //   }
      // }
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
    },
    transformValidateErrors: (e: Error) => {
      return {};
    }
  };

  formItem: FormItemCI = {
    name: "n-form-item",
    prop: "name",
    label: "label",
    rules: "rule"
  };

  option: OptionCI = {
    name: null,
    value: "value",
    label: "label"
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
    clearable: "clearable"
  };

  treeSelect: TreeSelectCI = {
    name: "n-tree-select",
    modelValue: "value",
    clearable: "clearable",
    value: "keyField",
    label: "labelField",
    children: "childrenField",
    options: "options"
  };
  table: TableCI = {
    name: "n-data-table",
    renderMode: "config",
    renderMethod: "render",
    rebuildRenderScope: (row, index) => {
      return { row, index };
    },
    buildMaxHeight: (maxHeight) => {
      return { maxHeight };
    },
    hasMaxHeight: (options) => {
      return options?.maxHeight != null;
    },
    data: "data",
    defaultRowKey: (rowData) => {
      return rowData.id;
    },
    fixedHeaderNeedComputeBodyHeight: true,
    headerDomSelector: ".n-data-table-thead",
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
    name: "n-input",
    type: "textarea",
    modelValue: "value",
    clearable: "clearable"
  };

  tag: TagCI = {
    name: "n-tag",
    type: "type",
    colors: ["success", "warning", "error", "info"]
  };

  inputGroup: InputGroupCI = {
    name: "n-input"
  };
  input: InputCI = {
    name: "n-input",
    clearable: "clearable",
    modelValue: "value"
  };
  inputPassword: InputPasswordCI = {
    name: "n-input",
    clearable: "clearable",
    modelValue: "value",
    passwordType: { type: "password" }
  };
  number: CI = {
    name: "n-input-number"
  };
  switch: SwitchCI = {
    activeColor: "active-color",
    activeText: "checkedChildren",
    activeValue: "checked-value",
    inactiveColor: "inactive-color",
    inactiveText: "unCheckedChildren",
    inactiveValue: "unchecked-value",
    modelValue: "value",
    name: "n-switch"
  };
  datePicker: DatePickerCI = {
    name: "n-date-picker",
    modelValue: "value",
    buildDateType(type) {
      return { name: "n-date-picker", type };
    }
  };
  timePicker: TimePickerCI = {
    name: "n-time-picker",
    modelValue: "value"
  };
  dropdown: DropdownCI = {
    name: "n-dropdown",
    command: (handler) => {
      return { onSelect: handler };
    },
    slotName: null,
    renderMode: "config",
    label: "label",
    value: "key",
    children: "children"
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
    name: "n-image-group"
  };
  image: ImageCI = {
    name: "n-image",
    buildPreviewBind: ({ url, urls, previewUrl, previewUrls }) => {
      return { "preview-src": previewUrl };
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
    typeImageCard: "image-card",
    typeImage: "image",
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
    modelValue: "expandedNames",
    keyName: "name"
  };
  collapseItem: CollapseItemCI = {
    name: "n-collapse-item"
  };
  tooltip: TooltipCI = {
    name: "n-tooltip",
    content: "default",
    trigger: "trigger"
  };
  divider: DividerCI = {
    name: "n-divider"
  };
  popover: PopoverCI = {
    name: "n-popover",
    visible: "show",
    contentSlotName: "default",
    referenceSlotName: "trigger"
  };
}
