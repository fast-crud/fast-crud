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
  FormCI,
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
  OptionCI,
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
import { DividerCI, PopoverCI, TooltipCI } from "../../ui-interface/src/ui-interface";
import _ from "lodash-es";
export class Antdv implements UiInterface {
  constructor(target) {
    this.notification.instance = target.Notification;
    this.message.instance = target.Message;
    this.messageBox.instance = target.MessageBox;
  }

  type = "antdv";
  modelValue = "value";

  formWrapper: FormWrapperCI = {
    visible: "visible",
    customClass: "class",
    titleSlotName: "title",
    buildOnClosedBind(is, onClosed: Function): {} {
      if (is === "a-modal") {
        return { afterClose: onClosed };
      } else if (is === "a-drawer") {
        return {
          onAfterVisibleChange: visible => {
            if (visible === false) {
              onClosed(visible);
            }
          }
        };
      }
      return {};
    },
    buildWidthBind(is, width) {
      return { width: width };
    },
    buildInitBind(is) {
      return {};
    },
    buildInnerBind({ getInnerWrapper }) {
      return {
        getContainer() {
          return getInnerWrapper();
        }
      };
    },
    name: "fs-form-wrapper"
  };

  messageBox: MessageBoxCI = {
    name: "a-model",
    instance: undefined,
    open: context => {
      return this.messageBox.confirm(context);
    },
    confirm: context => {
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
        this.messageBox.instance.confirm(newContext);
      });
    }
  };

  message: MessageCI = {
    instance: undefined,
    name: "a-message",
    open: (type, context) => {
      let content = context;
      if (typeof context !== "string") {
        content = context.message || context.content;
      }
      this.message.instance[type](content);
    },
    success: context => {
      this.message.open("success", context);
    },
    error: context => {
      this.message.open("error", context);
    },
    warn: context => {
      this.message.open("warn", context);
    },
    info: context => {
      this.message.open("info", context);
    }
  };

  notification: NotificationCI = {
    instance: undefined,
    name: "a-notification",
    open: (type, context) => {
      if (typeof context === "string") {
        context = {
          message: context
        };
      }
      type = type || context.type;
      if (type) {
        this.notification.instance[type](context);
      } else {
        this.notification.instance.open(context);
      }
    },
    success: context => {
      this.notification.open("success", context);
    },
    error: context => {
      this.notification.open("error", context);
    },
    warn: context => {
      this.notification.open("warn", context);
    },
    info: context => {
      this.notification.open("info", context);
    }
  };

  icon: IconCI = {
    name: "",
    isComponent: true
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
    name: "a-modal",
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
    name: "a-button",
    textType: { type: "link" },
    linkType: { type: "link" },
    circle: { shape: "circle" },
    colors: type => {
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
    name: "a-button-group"
  };

  card: CI = {
    name: "a-card"
  };

  cascader: CascaderCI = {
    name: "a-cascader",
    modelValue: "value",
    clearable: "allowClear",
    fieldNames(namesMap) {
      return { fieldNames: namesMap };
    }
  };

  checkboxGroup: CheckboxGroupCI = {
    name: "a-checkbox-group",
    modelValue: "value"
  };
  checkbox: CheckboxCI = {
    name: "a-checkbox",
    resolveEvent(e) {
      return e.target.checked;
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
    name: "a-col"
  };

  collapseTransition: CI = {
    name: "div"
  };

  drawer: DrawerCI = {
    name: "a-drawer",
    visible: "visible",
    customClass: "class",
    width: "width"
  };

  form: FormCI = {
    name: "a-form",
    inlineLayout: {
      layout: "inline",
      inline: true
    },
    resetWrap: (formRef, { form, initialForm }) => {
      //formRef.resetFields();
      const entries = _.entries(form);
      for (const entry of entries) {
        const initialValue = _.get(initialForm, entry[0]);
        if (initialValue == null) {
          _.unset(form, entry[0]);
        } else {
          _.set(form, entry[0], entry[1]);
        }
      }
    },
    validateWrap: async formRef => {
      return formRef.validate();
    },
    transformValidateErrors: (e: Error) => {
      // @ts-ignore
      const errorFields = e.errorFields;
      const errors = {};
      for (const errorField of errorFields) {
        for (const name of errorField.name) {
          errors[name] = true;
        }
      }
      return errors;
    }
  };

  formItem: FormItemCI = {
    name: "a-form-item",
    prop: "name",
    label: "label",
    rules: "rules"
  };

  option: OptionCI = {
    name: "a-select-option",
    value: "value",
    label: "label"
  };

  pagination: PaginationCI = {
    name: "a-pagination",
    currentPage: "current",
    total: "total",
    pageCount: null,
    onChange({ setCurrentPage, setPageSize, doAfterChange }) {
      return {
        // antd 页码改动回调
        onChange(page) {
          setCurrentPage(page);
          doAfterChange();
        },
        onShowSizeChange(current, size) {
          setPageSize(size);
          //无需刷新，上面onChange也会触发
          // doAfterChange();
        }
      };
    }
  };

  radio: RadioCI = {
    name: "a-radio",
    value: "value"
  };

  radioGroup: RadioGroupCI = {
    name: "a-radio-group",
    modelValue: "value"
  };

  row: CI = {
    name: "a-row"
  };

  select: SelectCI = {
    name: "a-select",
    modelValue: "value",
    clearable: "allowClear"
  };

  treeSelect: TreeSelectCI = {
    name: "a-tree-select",
    modelValue: "value",
    clearable: "allowClear",
    options: "tree-data",
    value: "value",
    label: "label",
    children: "children"
  };
  table: TableCI = {
    name: "a-table",
    data: "dataSource",
    renderMode: "config",
    renderMethod: "customRender",
    rebuildRenderScope: scope => {
      return scope;
    },
    buildMaxHeight: maxHeight => {
      return { scroll: { y: maxHeight } };
    },
    hasMaxHeight: options => {
      return options?.scroll?.y != null;
    },
    defaultRowKey: "id",
    fixedHeaderNeedComputeBodyHeight: true,
    headerDomSelector: ".ant-table-thead",
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
    name: "a-table-column",
    label: "title",
    prop: "key",
    row: "record",
    index: "index"
  };

  tableColumnGroup: TableColumnCI = {
    name: "a-table-column-group",
    label: "title",
    prop: "key",
    row: "record",
    index: "index"
  };

  textArea: TextAreaCI = {
    name: "a-textarea",
    type: undefined,
    modelValue: "value",
    clearable: "allowClear"
  };

  tag: TagCI = {
    name: "a-tag",
    type: "color",
    colors: ["blue", "green", "orange", "red", "cyan", "purple"]
  };

  inputGroup: InputGroupCI = {
    name: "a-input"
  };
  input: InputCI = {
    name: "a-input",
    clearable: "allowClear",
    modelValue: "value"
  };
  inputPassword: InputPasswordCI = {
    name: "a-input-password",
    clearable: "allowClear",
    modelValue: "value",
    passwordType: { showPassword: true }
  };
  number: CI = {
    name: "a-input-number"
  };
  switch: SwitchCI = {
    activeColor: "checkedColor",
    activeText: "checkedChildren",
    activeValue: "checkedValue",
    inactiveColor: "unCheckedColor",
    inactiveText: "unCheckedChildren",
    inactiveValue: "unCheckedValue",
    modelValue: "checked",
    name: "a-switch"
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
    }
  };
  timePicker: TimePickerCI = {
    name: "a-time-picker",
    modelValue: "value"
  };
  dropdown: DropdownCI = {
    name: "a-dropdown",
    command: () => {
      return {};
    },
    slotName: "overlay",
    renderMode: "slot"
  };
  dropdownMenu: DropdownMenuCI = {
    name: "a-menu",
    command: callback => {
      return {
        onClick($event) {
          callback($event.key);
        }
      };
    }
  };
  dropdownItem: DropdownItemCI = {
    name: "a-menu-item",
    command: "key"
  };
  imageGroup: ImageGroupCI = {
    name: "a-image-preview-group"
  };
  image: ImageCI = {
    name: "a-image",
    buildPreviewBind: ({ url, urls, previewUrl, previewUrls }) => {
      debugger;
      return {
        preview: {
          src: previewUrl
        }
      };
    }
  };
  progress: ProgressCI = {
    name: "a-progress"
  };
  loading: LoadingCI = {
    name: "a-spin",
    type: "component"
  };
  upload: UploadCI = {
    name: "a-upload",
    type: "",
    typeImageCard: "picture-card",
    typeImage: "picture",
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
    name: "a-tabs"
  };
  tabPane: TabPaneCI = {
    name: "a-tab-pane"
  };
  collapse: CollapseCI = {
    name: "a-collapse",
    modelValue: "activeKey",
    keyName: "key"
  };
  collapseItem: CollapseItemCI = {
    name: "a-collapse-panel"
  };
  tooltip: TooltipCI = {
    name: "a-tooltip",
    content: "title",
    trigger: "default"
  };
  divider: DividerCI = {
    name: "a-divider"
  };
  popover: PopoverCI = {
    name: "a-popover",
    contentSlotName: "content",
    referenceSlotName: "default",
    visible: "visible"
  };
}
