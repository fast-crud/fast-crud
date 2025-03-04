import "vue/jsx";
import type {
  BadgeCI,
  ButtonBuilderOptions,
  ButtonCI,
  ButtonGroupCI,
  CardCI,
  CascaderCI,
  CheckboxCI,
  CheckboxGroupCI,
  ColCI,
  CollapseCI,
  CollapseItemCI,
  CollapseTransitionCI,
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
  RadioButtonCI,
  RadioCI,
  RadioGroupCI,
  RowCI,
  SelectCI,
  SwitchCI,
  TableCI,
  TableColumnCI,
  TableScrollReq,
  TabPaneCI,
  TabsCI,
  TagCI,
  TextAreaCI,
  TimePickerCI,
  TooltipCI,
  TreeSelectCI,
  UiInterface,
  UploadCI
} from "@fast-crud/ui-interface";
import { creator, useUiRender } from "@fast-crud/ui-interface";
import { forEach } from "lodash-es";
import { Form, Modal } from "ant-design-vue";

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

    forEach(this, (value: any) => {
      if (value instanceof Object && value.builder) {
        value.render = (opts: any) => {
          return renderComponent(value, opts);
        };
      }
    });
  }

  type = "antdv";
  version = "3";
  modelValue = "value";

  formWrapper = creator<FormWrapperCI>({
    visible: "visible",
    customClass: () => {
      return "class";
    },
    titleSlotName: "title",
    buildOnClosedBind(is: string, onClosed): {} {
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
    buildInitBind() {
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
  });

  messageBox: MessageBoxCI = creator<MessageBoxCI>({
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
  });

  message = creator<MessageCI>({
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
  });

  notification: NotificationCI = creator<NotificationCI>({
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
  });

  icon: IconCI = creator<IconCI>({
    name: "",
    isComponent: true
  });

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
    caretDown: "CaretDownOutlined",
    eye: "EyeOutlined",
    info: "InfoCircleOutlined"
  };

  dialog: DialogCI = creator<DialogCI>({
    name: "a-modal",
    modelValue: "visible",
    visible: "visible",
    customClass: "wrapClassName",
    titleSlotName: "title",
    footerSlotName: "footer",
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

  button = creator<ButtonCI>({
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
  });

  buttonGroup = creator<ButtonGroupCI>({
    name: "a-space",
    builder(opts) {
      return buildBinding(this, opts, {});
    }
  });

  card: CardCI = creator<CardCI>({
    name: "a-card"
  });

  cascader = creator<CascaderCI>({
    name: "a-cascader",
    modelValue: "value",
    clearable: "allowClear",
    fieldNames(namesMap) {
      return { fieldNames: namesMap };
    }
  });

  checkboxGroup: CheckboxGroupCI = creator<CheckboxGroupCI>({
    name: "a-checkbox-group",
    modelValue: "value"
  });
  checkbox = creator<CheckboxCI>({
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
  });

  col = creator<ColCI>({
    name: "a-col"
  });

  collapseTransition = creator<CollapseTransitionCI>({
    name: "div"
  });

  drawer = creator<DrawerCI>({
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
  });

  form = creator<FormCI>({
    name: "a-form",
    inlineLayout: {
      layout: "inline",
      inline: true
    },
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
  });

  formItem = creator<FormItemCI>({
    name: "a-form-item",
    prop: "name",
    label: "label",
    rules: "rules",
    skipValidationWrapper: "a-form-item-rest",
    injectFormItemContext() {
      const formItemContext = Form.useInjectFormItemContext();
      return {
        async onChange() {
          formItemContext.onFieldChange();
        },
        async onBlur() {
          formItemContext.onFieldBlur();
        }
      };
    },
    builder(opts) {
      return buildBinding(this, opts, {});
    }
  });

  option: OptionCI = creator<OptionCI>({
    name: "a-select-option",
    value: "value",
    label: "label"
  });

  pagination: PaginationCI = creator<PaginationCI>({
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
  });

  radio: RadioCI = creator<RadioCI>({
    name: "a-radio",
    value: "value",
    builder(opts) {
      return buildBinding(this, opts, {
        props: {
          [this.value]: opts.value
        }
      });
    }
  });

  radioButton: RadioButtonCI = creator<RadioButtonCI>({
    name: "a-radio-button",
    value: "value",
    builder(opts) {
      return buildBinding(this, opts, {
        props: {
          [this.value]: opts.value
        }
      });
    }
  });

  radioGroup: RadioGroupCI = creator<RadioGroupCI>({
    name: "a-radio-group",
    modelValue: "value",
    builder(opts) {
      return buildBinding(this, opts, {});
    }
  });

  row = creator<RowCI>({
    name: "a-row",
    builder(opts) {
      return buildBinding(this, opts, {});
    }
  });

  select: SelectCI = creator<SelectCI>({
    name: "a-select",
    modelValue: "value",
    clearable: "allowClear",
    filterable: "showSearch",
    buildMultiBinding(multiple: boolean) {
      return {
        mode: multiple ? "multiple" : ""
      };
    },
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
  });

  treeSelect: TreeSelectCI = creator<TreeSelectCI>({
    name: "a-tree-select",
    modelValue: "value",
    clearable: "allowClear",
    options: "tree-data",
    value: "value",
    label: "label",
    children: "children",
    buildOptionKeysNameBinding(param: { children: any; label: any; value: any }): any {
      return {
        fieldNames: { label: param.label, key: param.value, value: param.value, children: param.children }
      };
    }
  });
  table: TableCI = creator<TableCI>({
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
    buildSelectionCrudOptions(req) {
      const selectedRowKeys = req.selectedRowKeys;
      const onChange = (changed: any[]) => {
        req.onSelectedKeysChanged(changed);
      };
      let type = "radio";
      if (req.multiple === true) {
        type = "checkbox";
      }
      return {
        table: {
          rowSelection: {
            type,
            selectedRowKeys,
            onChange,
            preserveSelectedRowKeys: req.crossPage
          }
        }
      };
    },
    scrollTo(req: TableScrollReq) {
      try {
        const body = req.fsTableRef?.vnode?.el?.querySelector(".ant-table-body");
        if (body) {
          body.scrollTop = req.top;
        }
      } catch (e) {
        console.error("scroll to top error:", e);
      }
    },
    onChange({ onSortChange, onFilterChange, onPagination, bubbleUp }) {
      return {
        onChange: (pagination: any, filters: any, sorter: any, ctx: any) => {
          const { currentDataSource } = ctx;
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

          bubbleUp((events: any) => {
            if (events?.onChange) {
              events.onChange(pagination, filters, sorter, ctx);
            }
          });
        }
      };
    }
  });

  tableColumn: TableColumnCI = creator<TableColumnCI>({
    name: "a-table-column",
    label: "title",
    prop: "key",
    row: "record",
    index: "index"
  });

  tableColumnGroup: TableColumnCI = creator<TableColumnCI>({
    name: "a-table-column-group",
    label: "title",
    prop: "key",
    row: "record",
    index: "index"
  });

  textArea: TextAreaCI = creator<TextAreaCI>({
    name: "a-textarea",
    type: undefined,
    modelValue: "value",
    clearable: "allowClear",
    builder(opts) {
      return buildBinding(this, opts, {
        [this.clearable]: opts.clearable
      });
    }
  });

  tag: TagCI = creator<TagCI>({
    name: "a-tag",
    type: "color",
    colors: ["blue", "green", "orange", "red", "cyan", "purple"]
  });

  inputGroup: InputGroupCI = creator<InputGroupCI>({
    name: "a-input"
  });
  input: InputCI = creator<InputCI>({
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
  });
  inputPassword: InputPasswordCI = creator<InputPasswordCI>({
    name: "a-input-password",
    clearable: "allowClear",
    modelValue: "value",
    passwordType: { showPassword: true }
  });
  number: InputNumberCI = creator<InputNumberCI>({
    name: "a-input-number",
    modelValue: "value",

    builder(opts: InputNumberBuilderOptions) {
      return buildBinding(this, opts, {});
    }
  });
  switch: SwitchCI = creator<SwitchCI>({
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
  });
  datePicker: DatePickerCI = creator<DatePickerCI>({
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
  });
  timePicker: TimePickerCI = creator<TimePickerCI>({
    name: "a-time-picker",
    modelValue: "value"
  });
  dropdown: DropdownCI = creator<DropdownCI>({
    name: "a-dropdown",
    command: () => {
      return {};
    },
    slotName: "overlay",
    renderMode: "slot"
  });
  dropdownMenu: DropdownMenuCI = creator<DropdownMenuCI>({
    name: "a-menu",
    command: (callback) => {
      return {
        onClick($event: any) {
          callback($event.key);
        }
      };
    }
  });
  dropdownItem: DropdownItemCI = creator<DropdownItemCI>({
    name: "a-menu-item",
    command: "key"
  });
  imageGroup: ImageGroupCI = creator<ImageGroupCI>({
    name: "a-image-preview-group"
  });
  image: ImageCI = creator<ImageCI>({
    name: "a-image",
    buildPreviewBind: ({ url, urls, previewUrl, previewUrls }) => {
      return {
        preview: {
          src: previewUrl
        }
      };
    },
    fallback: "fallback"
  });
  progress: ProgressCI = creator<ProgressCI>({
    name: "a-progress"
  });
  loading: LoadingCI = creator<LoadingCI>({
    name: "a-spin",
    type: "component"
  });
  upload = creator<UploadCI>({
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
  });
  tabs = creator<TabsCI>({
    name: "a-tabs",
    modelValue: "activeKey",
    tabChange: "change"
  });
  tabPane = creator<TabPaneCI>({
    name: "a-tab-pane",
    key: "key",
    tab: "tab"
  });

  collapse = creator<CollapseCI>({
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
  });
  collapseItem = creator<CollapseItemCI>({
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
  });
  badge: BadgeCI = creator<BadgeCI>({
    name: "a-badge",
    value: "count",
    builder(opts) {
      return buildBinding(this, opts, {
        props: {
          [this.value]: opts.value
        }
      });
    }
  });
  tooltip = creator<TooltipCI>({
    name: "a-tooltip",
    content: "title",
    trigger: "default"
  });
  divider = creator<DividerCI>({
    name: "a-divider"
  });
  popover = creator<PopoverCI>({
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
  });
}
