export interface CI {
  name: string;
}

export interface FormCI {
  name: string;
  inlineLayout: Object;
  // resetWrap: Function;
  validateWrap: (formRef: any) => Promise<any>;
  transformValidateErrors: (e: Error) => ComponentBinding;
}
export interface SelectCI extends CI {
  modelValue: string;
  clearable: string;
}
export interface OptionCI extends CI {
  // 默认的value和label字段名
  value: string;
  label: string;
}
export interface TreeSelectCI extends CI {
  modelValue: string;
  clearable: string;
  options: string;
  value: string;
  label: string;
  children: string;
}
export interface RadioCI extends CI {
  value: string;
}
export interface RadioGroupCI extends CI {
  modelValue: string;
}
export interface InputCI extends CI {
  clearable: string;
  modelValue: string;
}
export type InputGroupCI = CI;
export interface InputPasswordCI extends InputCI {
  passwordType: Object;
  clearable: string;
  modelValue: string;
}
export interface TextAreaCI extends CI {
  type: string;
  clearable: string;
  modelValue: string;
}

export type DialogFooterBuilder = (footer: any) => ComponentBinding;
export type DialogOnClosedBindBuilder = (onClose: (visible: boolean) => void) => ComponentBinding;
export interface DialogCI extends CI {
  visible: string;
  footer: DialogFooterBuilder;
  buildOnClosedBind: DialogOnClosedBindBuilder;
  customClass: string;
  titleSlotName?: string;
  buildWidthBind?: (width: any) => ComponentBinding;
  buildInitBind?: () => ComponentBinding;
}

export interface DrawerCI extends CI {
  visible: string;
  customClass: string;
  width: string;
  hasContentWrap?: string;
}

export interface TableColumnCI extends CI {
  label: string;
  prop: string;
  row: string;
  index: string;
}

export type TableOnChangeBindingBuilder = (context: {
  onSortChange: (sorter: any) => void;
  onFilterChange: (filters: any) => void;
  onPagination: (pagination: any) => void;
}) => any;

export type ComponentBinding = {
  [key: string]: any;
};

export interface TableCI extends CI {
  defaultRowKey?: string | ((rowData: any) => any);
  data: string;
  fixedHeaderNeedComputeBodyHeight: boolean;
  headerDomSelector: string; //用于计算高度
  buildMaxHeight: (maxHeight: number) => ComponentBinding;
  hasMaxHeight: (tableOptions: any) => boolean;
  vLoading: boolean | string;
  onChange: TableOnChangeBindingBuilder;
  /**
   * 列render的模式，antdv和naive为config模式，element为slot模式
   */
  renderMode: string;
  /**
   * render的方法名
   */
  renderMethod?: string;
  /**
   * render 方法触发时的参数构建出一个scope
   */
  rebuildRenderScope?: (scope: any, prop2?: any, prop3?: any, prop4?: any) => ComponentBinding;
}

export interface CheckboxGroupCI extends CI {
  modelValue: string;
}
export interface CheckboxCI extends CI {
  resolveEvent: (e: any) => any;
  value: string;
  modelValue: string;
  onChange: (onUpdateModelValue: (value: any) => any) => any;
}

export interface CascaderCI extends CI {
  modelValue: string;
  clearable: string;
  fieldNames: (namesMap: { value: string; label: string; children: string }) => any;
}

export type TabsCI = {
  modelValue: string;
} & CI;
export type TabPaneCI = {
  key: string;
  tab: string;
} & CI;
export interface CollapseCI extends CI {
  modelValue: string;
  keyName: string;
}
export type CollapseItemCI = CI;
export interface SwitchCI extends CI {
  modelValue: string;
  activeColor: string;
  activeValue: string;
  activeText: string;
  inactiveText: string;
  inactiveColor: string;
  inactiveValue: string;
}

export type MessageContext = string | { type?: string; message?: string; content?: string };

export interface MessageCI extends CI {
  open: (type: string, context: MessageContext) => void;
  success: (context: MessageContext) => void;
  error: (context: MessageContext) => void;
  warn: (context: MessageContext) => void;
  info: (context: MessageContext) => void;
  instance: any;
  getInstance?: any;
}

export type MessageBoxContextType = {
  title?: string;
  message?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  type?: string;
};
export type MessageBoxOpenType = (context: MessageBoxContextType) => Promise<void>;
export interface MessageBoxCI extends CI {
  open: MessageBoxOpenType;
  confirm: MessageBoxOpenType;
  instance: any;
  getInstance?: any;
}

export type NotificationContext = string | { type?: string; message?: string; text?: string };

export interface NotificationCI extends CI {
  open: (type: string, context: NotificationContext) => void;
  success: (message: NotificationContext) => void;
  error: (message: NotificationContext) => void;
  warn: (message: NotificationContext) => void;
  info: (message: NotificationContext) => void;
  instance: any;
  getInstance?: any;
}
export interface IconCI extends CI {
  isComponent: boolean;
  circle?: Record<string, any>;
}
export interface FormItemCI extends CI {
  prop: string;
  label: string;
  rules: string;
}

export interface TooltipCI extends CI {
  // tooltip框里的内容slotName
  content: string;
  // 触发按钮内容slotName
  trigger: string;
}

export interface TagCI extends CI {
  type: string;
  colors: Array<string>;
}

type FormWrapperOnClosedBindBuilder = (is: string, onClose: (visible: boolean) => void) => any;

export interface FormWrapperCI extends CI {
  visible: string;
  buildOnClosedBind: FormWrapperOnClosedBindBuilder;
  customClass: (is: string) => string;
  titleSlotName: string;
  buildWidthBind: (is: string, width: any) => {};
  buildInitBind: (is: string) => {};
  buildInnerBind: (opts: any) => {};
  hasContentWrap?: (is: string) => string | undefined;
}
export interface DatePickerCI extends CI {
  modelValue: string;
  buildDateType: (type: string) => ComponentBinding;
}
export interface TimePickerCI extends CI {
  modelValue: string;
}
export interface DropdownCI extends CI {
  command: (callback: (key: any) => void) => ComponentBinding;
  slotName: string;
  /**
   * 选项的渲染模式，slot or config
   */
  renderMode: string;
  value?: string;
  label?: string;
  children?: string;
}
export interface DropdownMenuCI extends CI {
  command: (callback: (key: string) => void) => ComponentBinding;
}
export interface DropdownItemCI extends CI {
  command: string;
}
export type ImageGroupCI = CI;

export type ImagePreviewBindBuilder = (opts: {
  url: string;
  urls: string[];
  previewUrl: string;
  previewUrls: string[];
  index: number;
}) => any;

export interface ImageCI extends CI {
  buildPreviewBind: ImagePreviewBindBuilder;
}
export type ProgressCI = CI;
export interface LoadingCI extends CI {
  name: string;
  type: string;
}
export interface UploadCI extends CI {
  id: string;
  name: string;
  type: string;
  typeImageCard: string;
  typeImage: string;
  getStatusFromEvent: (event: any) => string;
  getFileListFromEvent: (event: any, event2?: any, event3?: any, event4?: any) => any[];
  status: {
    success: string;
    uploading: string;
  };
  limitAdd: number;
  isSuccess: (fileItem: any) => Boolean;
}
export interface ButtonCI extends CI {
  name: string;
  textType: Object;
  linkType: Object;
  colors: (type: string) => any;
  circle: Object;
}

export type PaginationOnChangeContext = {
  setCurrentPage: (current: number) => void;
  setPageSize: (pageSize: number) => void;
  doAfterChange: () => Promise<void>;
};
export type PaginationOnChangeBindingBuilder = (context: PaginationOnChangeContext) => any;
export interface PaginationCI extends CI {
  name: string;
  currentPage: string;
  onChange: PaginationOnChangeBindingBuilder;
  total: string;
  pageCount: string;
}

export interface DividerCI extends CI {
  name: string;
}

export interface PopoverCI extends CI {
  name: string;

  /**
   * 内容插槽
   */
  contentSlotName: string;

  referenceSlotName: string;
  visible: string;
}

export interface Icons {
  refresh: string;
  search: string;
  compact: string;
  columnsFilter: string;
  add: string;
  edit: string;
  remove: string;
  export: string;
  check: string;
  sort: string;
  close: string;
  left: string;
  right: string;
  arrowLeft: string;
  arrowRight: string;
  more: string;
  plus: string;
  zoomIn: string;
  zoomOut: string;
  refreshLeft: string;
  refreshRight: string;
  upload: string;
  fullScreen: string;
  unFullScreen: string;
  question: string;
  caretUp: string;
  caretDown: string;
}
export interface UiInterface {
  modelValue: string;
  type: string;
  inputGroup: InputGroupCI;
  input: InputCI;
  inputPassword: InputPasswordCI;
  textArea: TextAreaCI;
  tag: TagCI;
  table: TableCI;
  tableColumn: TableColumnCI;
  tableColumnGroup: TableColumnCI;
  pagination: PaginationCI;
  button: ButtonCI;
  form: FormCI;
  formItem: FormItemCI;
  tooltip: TooltipCI;
  radioGroup: RadioGroupCI;
  radio: RadioCI;
  checkboxGroup: CheckboxGroupCI;
  checkbox: CheckboxCI;
  select: SelectCI;
  treeSelect: TreeSelectCI;
  option: OptionCI;
  collapseTransition: CI;
  card: CI;
  drawer: DrawerCI;
  col: CI;
  row: CI;
  buttonGroup: CI;
  dialog: DialogCI;
  icon: IconCI;
  icons: Icons;
  message: MessageCI;
  notification: NotificationCI;
  messageBox: MessageBoxCI;
  formWrapper: FormWrapperCI;
  number: CI;
  cascader: CascaderCI;
  switch: SwitchCI;
  datePicker: DatePickerCI;
  timePicker: TimePickerCI;
  dropdown: DropdownCI;
  dropdownMenu: DropdownMenuCI;
  dropdownItem: DropdownItemCI;
  imageGroup: ImageGroupCI;
  image: ImageCI;
  progress: ProgressCI;
  loading: LoadingCI;
  upload: UploadCI;
  tabs: TabsCI;
  tabPane: TabPaneCI;
  collapse: CollapseCI;
  collapseItem: CollapseItemCI;
  divider: DividerCI;
  popover: PopoverCI;
}
