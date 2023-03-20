import {
  BadgeCI,
  BindBuilderOptions,
  ButtonBuilderOptions,
  ButtonCI,
  ButtonGroupCI,
  CascaderCI,
  CheckboxCI,
  CheckboxGroupCI,
  CI,
  CollapseCI,
  CollapseItemCI,
  DatePickerCI,
  DialogCI,
  DividerCI,
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
  InputNumberBuilderOptions,
  InputNumberCI,
  InputPasswordCI,
  LoadingCI,
  MessageBoxCI,
  MessageCI,
  NotificationCI,
  NotificationContext,
  OptionCI,
  PaginationCI,
  PopoverBuilderOptions,
  PopoverCI,
  ProgressCI,
  RadioCI,
  RadioGroupCI,
  SelectCI,
  SwitchCI,
  TableCI,
  TableColumnCI,
  TabPaneCI,
  TabsCI,
  TagCI,
  TextAreaCI,
  TimePickerCI,
  TooltipCI,
  TreeSelectCI,
  UiInterface,
  UiSlot,
  UploadCI,
  useUiRender
} from "@fast-crud/ui-interface";

import _ from "lodash-es";
import { Modal } from "ant-design-vue";

export type AntdvUiProvider = {
  Notification: any;
  Message: any;
  MessageBox: any;
};

const { buildBinding, renderComponent } = useUiRender();
export class Antdv implements UiInterface {
  constructor(target: AntdvUiProvider) {
    this.notification.instance = target.Notification;
    this.message.instance = target.Message;
    this.messageBox.instance = target.MessageBox;

    _.forEach(this, (value: any) => {
      if (value instanceof Object && value.builder) {
        value.render = (opts: any) => {
          return renderComponent(value, opts);
        };
      }
    });
  }

  type = "antdv";
  modelValue = "value";

  formWrapper: FormWrapperCI = {
    visible: "visible",
    customClass: () => {
      return "class";
    },
    titleSlotName: "title",
    buildOnClosedBind(is, onClosed: (visible: boolean) => void): {} {
      if (is === "a-modal") {
        return { afterClose: onClosed };
      } else if (is === "a-drawer") {
        return {
          onAfterVisibleChange: (visible: boolean) => {
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
    name: "a-notification",
    open: (type: string, context: NotificationContext) => {
      if (typeof context === "string") {
        context = {
          message: context
        };
      }
      type = type || context.type;
      if (type) {
        return this.notification.instance[type](context);
      } else {
        return this.notification.instance.open(context);
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
    question: "QuestionCircleOutlined",
    caretUp: "CaretUpOutlined",
    caretDown: "CaretDownOutlined"
  };

  dialog: DialogCI = {
    name: "a-modal",
    modelValue: "visible",
    visible: "visible",
    customClass: "wrapClassName",
    footer(footer: any = null) {
      return { footer };
    },
    buildOnClosedBind(onClosed): {} {
      return { afterClose: onClosed };
    },
    open(opts) {
      Modal[opts.type]({
        ...opts,
        type: null
      } as any);
    },
    builder(opts) {
      return buildBinding(this, opts, {
        slots: {
          footer: opts.footer
        }
      });
    }
  };

  button: ButtonCI = {
    name: "a-button",
    textType: { type: "link" },
    linkType: { type: "link" },
    circle: { shape: "circle" },
    colors: (type) => {
      if (type === "danger") {
        return { danger: true };
      }
      if (type === "info" || type === "warning") {
        return {};
      }
      return { type };
    },
    builder(opts: ButtonBuilderOptions) {
      return buildBinding(this, opts, {
        slots: {
          icon: opts.icon
        }
      });
    }
  };

  buttonGroup: ButtonGroupCI = {
    name: "a-space",
    builder(opts) {
      return buildBinding(this, opts, {});
    },
    render(opts) {
      return renderComponent(this, opts);
    }
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
    onChange(onUpdateModelValue) {
      return {
        "onUpdate:checked": onUpdateModelValue
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
    width: "width",
    modelValue: "visible",
    builder(opts) {
      return buildBinding(this, opts, {
        props: {
          [this.width]: opts.width
        }
      });
    }
  };

  form: FormCI = {
    name: "a-form",
    inlineLayout: {
      layout: "inline",
      inline: true
    },
    // resetWrap: (formRef, { form, initialForm }) => {
    //   //formRef.resetFields();
    //   debugger;
    //   const entries = _.entries(form);
    //   for (const entry of entries) {
    //     const initialValue = _.get(initialForm, entry[0]);
    //     if (initialValue == null) {
    //       _.unset(form, entry[0]);
    //     } else {
    //       _.set(form, entry[0], initialValue);
    //     }
    //   }
    // },
    validateWrap: async (formRef) => {
      return formRef.validate();
    },
    transformValidateErrors: (e: Error) => {
      // @ts-ignore
      const errorFields = e.errorFields;
      const errors: any = {};
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
    onChange(props) {
      const { setCurrentPage, setPageSize, doAfterChange } = props;
      return {
        // antd 页码改动回调
        onChange(page: number) {
          setCurrentPage(page);
          doAfterChange();
        },
        onShowSizeChange(current: number, size: number) {
          setPageSize(size);
          //无需刷新，上面onChange也会触发
          // doAfterChange();
        }
      };
    }
  };

  radio: RadioCI = {
    name: "a-radio",
    value: "value",
    builder(opts) {
      return buildBinding(this, opts, {});
    }
  };

  radioGroup: RadioGroupCI = {
    name: "a-radio-group",
    modelValue: "value",
    builder(opts) {
      return buildBinding(this, opts, {});
    }
  };

  row: CI = {
    name: "a-row",
    builder(opts) {
      return buildBinding(this, opts, {});
    }
  };

  select: SelectCI = {
    name: "a-select",
    modelValue: "value",
    clearable: "allowClear",
    builder(opts) {
      return buildBinding(this, opts, {
        props: {
          mode: opts.multiple ? "multiple" : "combobox",
          options: opts.options,
          fieldNames: { value: opts.valueName || "value", label: opts.labelName || "label" },
          [this.clearable]: opts.clearable
        }
      });
    }
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
    rebuildRenderScope: (scope) => {
      return scope;
    },
    buildMaxHeight: (maxHeight) => {
      return { scroll: { y: maxHeight } };
    },
    hasMaxHeight: (options) => {
      return options?.scroll?.y != null;
    },
    defaultRowKey: "id",
    fixedHeaderNeedComputeBodyHeight: true,
    headerDomSelector: ".ant-table-thead",
    vLoading: false,
    onChange({ onSortChange, onFilterChange, onPagination }) {
      return {
        onChange: (pagination: any, filters: any, sorter: any, { currentDataSource }: any) => {
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
    clearable: "allowClear",
    builder(opts) {
      return buildBinding(this, opts, {
        [this.clearable]: opts.clearable
      });
    }
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
    modelValue: "value",
    builder(opts) {
      return buildBinding(this, opts, {
        props: {
          [this.clearable]: opts.clearable
        }
      });
    }
  };
  inputPassword: InputPasswordCI = {
    name: "a-input-password",
    clearable: "allowClear",
    modelValue: "value",
    passwordType: { showPassword: true }
  };
  number: InputNumberCI = {
    name: "a-input-number",
    modelValue: "value",

    builder(opts: InputNumberBuilderOptions) {
      return buildBinding(this, opts, {});
    }
  };
  switch: SwitchCI = {
    activeColor: "checkedColor",
    activeText: "checkedChildren",
    activeValue: "checkedValue",
    inactiveColor: "unCheckedColor",
    inactiveText: "unCheckedChildren",
    inactiveValue: "unCheckedValue",
    modelValue: "checked",
    name: "a-switch",
    builder(opts) {
      return buildBinding(this, opts, {
        [this.activeValue]: opts.activeValue,
        [this.activeColor]: opts.activeColor,
        [this.activeText]: opts.activeText,
        [this.inactiveValue]: opts.inactiveValue,
        [this.inactiveColor]: opts.inactiveColor,
        [this.inactiveText]: opts.inactiveText
      });
    }
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
        return { name: "a-date-picker", picker: "month" };
      }
      if (type === "week") {
        return { name: "a-date-picker", picker: "week" };
      }
      if (type === "quarter") {
        return { name: "a-date-picker", picker: "quarter" };
      }
      if (type === "year") {
        return { name: "a-date-picker", picker: "year" };
      }
      return { name: "a-date-picker", picker: "type" };
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
    command: (callback) => {
      return {
        onClick($event: any) {
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
    id: "uid",
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
    isSuccess(fileItem) {
      return fileItem.status == null || fileItem.status === "done";
    },
    limitAdd: 0
  };
  tabs: TabsCI = {
    name: "a-tabs",
    modelValue: "activeKey"
  };
  tabPane: TabPaneCI = {
    name: "a-tab-pane",
    key: "key",
    tab: "tab"
  };

  collapse: CollapseCI = {
    name: "a-collapse",
    modelValue: "activeKey",
    keyName: "key",
    builder(opts) {
      return buildBinding(this, opts, {
        props: {
          [this.keyName]: opts.key
        }
      });
    }
  };
  collapseItem: CollapseItemCI = {
    name: "a-collapse-panel",
    titleSlotName: "header",
    extraSlotName: "extra",
    key: "key",
    builder(opts) {
      return buildBinding(this, opts, {
        props: {
          [this.key]: opts.key
        },
        slots: {
          [this.titleSlotName]: opts.titleSlot,
          [this.extraSlotName]: opts.extraSlot
        }
      });
    }
  };
  badge: BadgeCI = {
    name: "a-badge",
    value: "count",
    builder(opts) {
      return buildBinding(this, opts, {
        props: {
          [this.value]: opts.value
        }
      });
    }
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
    triggerSlotName: "default",
    visible: "visible",
    builder(opts: PopoverBuilderOptions) {
      function position() {
        if (opts.position) {
          return {
            overlayStyle: {
              top: opts.position.y,
              left: opts.position.x
            }
          };
        }
        return {};
      }
      return buildBinding(this, opts, {
        props: {
          ...position()
        },
        slots: {
          [this.contentSlotName]: opts.contentSlot,
          [this.triggerSlotName]: opts.triggerSlot
        }
      });
    }
  };
}
