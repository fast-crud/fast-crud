import "vue/jsx";
import type {
  BadgeCI,
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
  InputNumberCI,
  InputPasswordCI,
  LoadingCI,
  MessageBoxCI,
  MessageBoxContextType,
  MessageCI,
  NotificationCI,
  OptionCI,
  PaginationCI,
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
import { useUiRender } from "@fast-crud/ui-interface";
import { forEach } from "lodash-es";
import { formItemInjectionKey } from "naive-ui/es/_mixins/use-form-item";
import { inject } from "vue";

export type NaiveUiProviders = {
  notification: any;
  message: any;
  messageBox: any;
  i18n: any;
};

const { buildBinding, renderComponent, creator } = useUiRender();

export class Naive implements UiInterface {
  constructor(target?: NaiveUiProviders) {
    if (target) {
      this.init(target);
    }

    forEach(this, (value: any) => {
      if (value instanceof Object && value.builder) {
        value.render = (opts: any) => {
          return renderComponent(value, opts);
        };
      }
    });
  }

  init({ notification, message, messageBox, i18n }: NaiveUiProviders) {
    this.notification.instance = notification;
    this.message.instance = message;
    this.messageBox.instance = messageBox;
    this.i18n = i18n;
  }

  type = "naive";
  modelValue = "value";
  i18n: any = null;

  formWrapper: FormWrapperCI = creator<FormWrapperCI>({
    visible: "show",
    customClass: (is: string) => {
      return "class";
    },
    titleSlotName: "header",
    buildOnClosedBind(is: string, onClosed: Function): {} {
      return {
        onAfterLeave: onClosed
      };
    },
    buildWidthBind(is: string, width: any) {
      return { style: { width: width } };
    },
    buildInitBind(is: string) {
      return { preset: "card" };
    },
    buildInnerBind({ getInnerWrapper }: { getInnerWrapper: () => any }) {
      return { to: getInnerWrapper() };
    },
    hasContentWrap(is: string) {
      if (is === "n-drawer") {
        return "n-drawer-content";
      }
    },
    name: "fs-form-wrapper"
  });

  messageBox: MessageBoxCI = creator<MessageBoxCI>({
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
    open: (context: MessageBoxContextType) => {
      return this.messageBox.getInstance().info(context);
    },
    confirm: (context: MessageBoxContextType) => {
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
  });

  message: MessageCI = creator<MessageCI>({
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
    open: (type: any, context: any) => {
      let content = context;
      if (typeof context !== "string") {
        content = context.message || context.content;
      }
      this.message.getInstance()[type](content);
    },
    success: (context: any) => {
      this.message.open("success", context);
    },
    error: (context: any) => {
      this.message.open("error", context);
    },
    warn: (context: any) => {
      this.message.open("warning", context);
    },
    info: (context: any) => {
      this.message.open("info", context);
    }
  });

  notification: NotificationCI = creator<NotificationCI>({
    instance: undefined,
    name: "n-notification",
    getInstance() {
      if (!this.instance) {
        throw new Error(
          "您还未设置ui,第一步：先安装依赖@fast-crud/ui-interface,然后在use(FastCrud)前安装ui，app.use(UiXxx)；第二步：还需要用fs-ui-context包裹router-view，请参考http://fast-crud.docmirror.cn/guide/start/integration.html#_5-naiveui%E7%9A%84%E9%A2%9D%E5%A4%96%E6%93%8D%E4%BD%9C"
        );
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
        } as any;
      } else {
        if (context.title == null) {
          context.title = context.message;
        }
      }

      context = Object.assign({ duration: 5000 }, context);
      type = type || (context as any).type;
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
  });

  icon: IconCI = creator<IconCI>({
    name: "",
    isComponent: true,
    circle: { shape: "circle" }
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
    name: "n-modal",
    modelValue: "show",
    visible: "show",
    customClass: "class",
    titleSlotName: "header",
    footerSlotName: "action",
    footer(footer = null) {
      return { footer };
    },
    buildOnClosedBind(onClosed: Function): {} {
      return {
        onAfterLeave: onClosed
      };
    },
    buildWidthBind(width) {
      return { style: { width: width } };
    },
    buildInitBind() {
      return { preset: "card" };
    },
    open: (opts) => {
      let type: string = opts.type;
      let showIcon = true;
      if (opts.type === "confirm") {
        type = "create";
        showIcon = false;
      }
      this.messageBox.instance[type]({
        title: opts.title,
        content: opts.content,
        positiveText: opts.okText,
        negativeText: opts.cancelText,
        onPositiveClick: opts.onOk,
        onNegativeClick: opts.onCancel,
        showIcon
      });
    },
    builder(opts) {
      return buildBinding(this, opts, {
        props: {
          preset: "dialog",
          title: opts.title,
          style: {
            width: opts.width
          }
        },
        slots: {
          footer: opts.footer
        }
      });
    }
  });

  button: ButtonCI = creator<ButtonCI>({
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
  });

  buttonGroup = creator<ButtonGroupCI>({
    name: "n-button-group"
  });

  card = creator<CardCI>({
    name: "n-card"
  });

  cascader: CascaderCI = creator<CascaderCI>({
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
  });

  checkboxGroup: CheckboxGroupCI = creator<CheckboxGroupCI>({
    name: "n-checkbox-group",
    modelValue: "value"
  });
  checkbox: CheckboxCI = creator<CheckboxCI>({
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
  });

  col = creator<ColCI>({
    name: "n-col"
  });

  collapseTransition = creator<CollapseTransitionCI>({
    name: "div"
  });

  drawer: DrawerCI = creator<DrawerCI>({
    name: "n-drawer",
    visible: "show",
    customClass: "class",
    width: "width",
    hasContentWrap: "n-drawer-content"
  });

  form: FormCI = creator<FormCI>({
    name: "n-form",
    inlineLayout: {
      inline: true,
      labelPlacement: "left"
    },
    // resetWrap: (formRef, { form, initialForm }) => {
    //   const entries = entries(form);
    //   for (const entry of entries) {
    //     const initialValue = get(initialForm, entry[0]);
    //     if (initialValue == null) {
    //       unset(form, entry[0]);
    //     } else {
    //       set(form, entry[0], initialValue);
    //     }
    //   }
    //   // const keys = Object.keys(form);
    //   // for (const key of keys) {
    //   //   if (initialForm[key] != null) {
    //   //     form[key] = initialForm[key];
    //   //   } else {
    //   //     delete form[key];
    //   //   }
    //   // }
    // },
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
  });

  formItem: FormItemCI = creator<FormItemCI>({
    name: "n-form-item",
    prop: "name",
    label: "label",
    rules: "rule",
    skipValidationWrapper: "div",
    injectFormItemContext: () => {
      const formItemContext = inject(formItemInjectionKey);
      return {
        async onBlur() {
          formItemContext.handleContentBlur();
        },
        async onChange() {
          formItemContext.handleContentChange();
        }
      };
    }
  });

  option: OptionCI = creator<OptionCI>({
    name: null,
    value: "value",
    label: "label"
  });

  pagination: PaginationCI = creator<PaginationCI>({
    name: "n-pagination",
    currentPage: "page",
    total: "itemCount",
    pageCount: "pageCount",
    onChange({ setCurrentPage, setPageSize, doAfterChange }) {
      return {
        // antd 页码改动回调
        "onUpdate:page": (page: any) => {
          setCurrentPage(page);
          doAfterChange();
        },
        "onUpdate:pageSize": (pageSize: any) => {
          setPageSize(pageSize);
          doAfterChange();
        }
      };
    }
  });

  radio: RadioCI = creator<RadioCI>({
    name: "n-radio",
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
    name: "n-radio-button",
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
    name: "n-radio-group",
    modelValue: "value"
  });

  row: RowCI = creator<RowCI>({
    name: "n-row"
  });

  select: SelectCI = creator<SelectCI>({
    name: "n-select",
    modelValue: "value",
    clearable: "clearable",
    filterable: "filterable",
    buildMultiBinding: (multiple) => {
      return { multiple };
    }
  });

  treeSelect: TreeSelectCI = creator<TreeSelectCI>({
    name: "n-tree-select",
    modelValue: "value",
    clearable: "clearable",
    value: "keyField",
    label: "labelField",
    children: "childrenField",
    options: "options",
    buildOptionKeysNameBinding(param: { children: any; label: any; value: any }): any {
      return {
        keyField: param.value,
        labelField: param.label,
        childrenField: param.children
      };
    }
  });
  table: TableCI = creator<TableCI>({
    name: "n-data-table",
    renderMode: "config",
    renderMethod: "render",
    rebuildRenderScope: (row: any, index: number) => {
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
    scrollTo(req: TableScrollReq) {
      req.tableRef?.value?.scrollTo({ top: req.top });
    },
    buildSelectionCrudOptions(req) {
      const onSelectionChange = (changed: any = []) => {
        req.onSelectedKeysChanged(changed);
      };

      const selectedRowKeys = req.selectedRowKeys instanceof Function ? req.selectedRowKeys() : req.selectedRowKeys;
      return {
        table: {
          checkedRowKeys: selectedRowKeys,
          "onUpdate:checkedRowKeys": onSelectionChange
        },
        columns: {
          $checked: {
            form: { show: false },
            column: {
              multiple: !!req.multiple,
              type: "selection",
              align: "center",
              width: "55px",
              order: -9999,
              columnSetDisabled: true //禁止在列设置中选择
            }
          }
        }
      };
    },
    onChange({ onSortChange, onFilterChange, onPagination, bubbleUp }) {
      return {
        "onUpdate:filters": (filters: any, initiatorColumn: any) => {
          if (onFilterChange) {
            onFilterChange(filters);
          }

          bubbleUp((events: any) => {
            if (events["onUpdate:sorter"]) {
              events["onUpdate:sorter"](filters, initiatorColumn);
            }
          });
        },
        "onUpdate:sorter": (scope: any) => {
          if (onSortChange) {
            /**
             * columnKey: string | number
             *   sorter: 'default' | function | boolean
             *   order: 'ascend' | 'descend' | false
             */
            const { columnKey, sorter, order } = scope;
            onSortChange({
              isServerSort: sorter === "custom",
              prop: columnKey,
              order,
              asc: order === "ascend"
            });
          }
          bubbleUp((events: any) => {
            if (events["onUpdate:sorter"]) {
              events["onUpdate:sorter"](scope);
            }
          });
        }
      };
    }
  });

  tableColumn: TableColumnCI = creator<TableColumnCI>({
    name: "n-table-column",
    label: "title",
    prop: "key",
    row: "row",
    index: "index"
  });

  tableColumnGroup: TableColumnCI = creator<TableColumnCI>({
    name: "n-table-column-group",
    label: "title",
    prop: "key",
    row: "record",
    index: "index"
  });

  textArea: TextAreaCI = creator<TextAreaCI>({
    name: "n-input",
    type: "textarea",
    modelValue: "value",
    clearable: "clearable"
  });

  tag: TagCI = creator<TagCI>({
    name: "n-tag",
    type: "type",
    colors: ["success", "warning", "error", "info"]
  });

  inputGroup: InputGroupCI = creator<InputGroupCI>({
    name: "n-input"
  });
  input: InputCI = creator<InputCI>({
    name: "n-input",
    clearable: "clearable",
    modelValue: "value"
  });
  inputPassword: InputPasswordCI = creator<InputPasswordCI>({
    name: "n-input",
    clearable: "clearable",
    modelValue: "value",
    passwordType: { type: "password" }
  });
  number: InputNumberCI = creator<InputNumberCI>({
    name: "n-input-number",
    modelValue: "value",
    builder(opts) {
      return buildBinding(this, opts, {});
    }
  });
  switch: SwitchCI = creator<SwitchCI>({
    activeColor: "active-color",
    activeText: "checkedChildren",
    activeValue: "checked-value",
    inactiveColor: "inactive-color",
    inactiveText: "unCheckedChildren",
    inactiveValue: "unchecked-value",
    modelValue: "value",
    name: "n-switch"
  });
  datePicker: DatePickerCI = creator<DatePickerCI>({
    name: "n-date-picker",
    modelValue: "value",
    buildDateType(type) {
      return { name: "n-date-picker", type };
    }
  });
  timePicker: TimePickerCI = creator<TimePickerCI>({
    name: "n-time-picker",
    modelValue: "value"
  });
  dropdown: DropdownCI = creator<DropdownCI>({
    name: "n-dropdown",
    command: (handler) => {
      return { onSelect: handler };
    },
    slotName: null,
    renderMode: "config",
    label: "label",
    value: "key",
    children: "children"
  });
  dropdownMenu: DropdownMenuCI = creator<DropdownMenuCI>({
    name: "n-menu",
    command: (callback) => {
      return {
        onClick($event: any) {
          callback($event.key);
        }
      };
    }
  });
  dropdownItem: DropdownItemCI = creator<DropdownItemCI>({
    name: "n-menu-item",
    command: "key"
  });
  imageGroup: ImageGroupCI = creator<ImageGroupCI>({
    name: "n-image-group"
  });
  image: ImageCI = creator<ImageCI>({
    name: "n-image",
    buildPreviewBind: ({ url, urls, previewUrl, previewUrls }) => {
      return { "preview-src": previewUrl };
    },
    fallback: "fallbackSrc"
  });
  progress: ProgressCI = creator<ProgressCI>({
    name: "n-progress"
  });
  loading: LoadingCI = creator<LoadingCI>({
    name: "n-spin",
    type: "component"
  });
  upload: UploadCI = creator<UploadCI>({
    id: "id",
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
      success: "finished",
      uploading: "uploading"
    },
    limitAdd: 0,
    isSuccess(fileItem) {
      return fileItem.status == null || fileItem.status === "finished";
    }
  });
  tabs: TabsCI = creator<TabsCI>({
    name: "n-tabs",
    modelValue: "value",
    tabChange: "change"
  });
  tabPane: TabPaneCI = creator<TabPaneCI>({
    name: "n-tab-pane",
    key: "name",
    tab: "tab"
  });
  collapse: CollapseCI = creator<CollapseCI>({
    name: "n-collapse",
    modelValue: "expandedNames",
    keyName: "name"
  });
  collapseItem: CollapseItemCI = creator<CollapseItemCI>({
    name: "n-collapse-item",
    titleSlotName: "header",
    extraSlotName: "header-extra",
    key: "name",
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
    name: "n-badge",
    value: "value",
    builder(opts) {
      return buildBinding(this, opts, {
        props: {
          [this.value]: opts.value
        }
      });
    }
  });
  tooltip: TooltipCI = creator<TooltipCI>({
    name: "n-tooltip",
    content: "default",
    trigger: "trigger"
  });
  divider: DividerCI = creator<DividerCI>({
    name: "n-divider"
  });
  popover: PopoverCI = creator<PopoverCI>({
    name: "n-popover",
    visible: "show",
    contentSlotName: "default",
    triggerSlotName: "trigger"
  });
}
