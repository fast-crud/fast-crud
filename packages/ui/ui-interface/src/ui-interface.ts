export interface CI {
  name;
}

export interface FormCI {
  name;
  inlineLayout: Object;
  resetWrap: Function;
  validateWrap: Function;
  transformValidateErrors: (e:Error) => { [key: string]: any }
}
export interface SelectCI extends CI {
  modelValue;
  clearable;
}
export interface OptionCI extends CI {
  // 默认的value和label字段名
  value: string;
  label: string;
}
export interface TreeSelectCI extends CI {
  modelValue;
  clearable;
  options: string;
  value: string;
  label: string;
  children: string;
}
export interface RadioCI extends CI {
  value;
}
export interface RadioGroupCI extends CI {
  modelValue;
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
  type;
  clearable;
  modelValue;
}

export interface DialogCI extends CI {
  visible;
  footer: Function;
  buildOnClosedBind: Function;
  customClass;
  titleSlotName?:string;
  buildWidthBind?:any;
  buildInitBind?:any;
}

export interface DrawerCI extends CI {
  visible;
  customClass;
  width;
  hasContentWrap?:string;
}

export interface TableColumnCI extends CI {
  label;
  prop;
  row;
  index;
}

export interface TableCI extends CI {
  defaultRowKey?: (string|((rowData:any)=>any));
  data;
  fixedHeaderNeedComputeBodyHeight: boolean;
  headerDomSelector: string; //用于计算高度
  buildMaxHeight: Function;
  hasMaxHeight: Function;
  vLoading;
  onChange;
  /**
   * 列render的模式，antdv和naive为config模式，element为slot模式
   */
  renderMode;
  /**
   * render的方法名
   */
  renderMethod?: string;
  /**
   * render 方法触发时的参数构建出一个scope
   */
  rebuildRenderScope?: Function;
}

export interface CheckboxGroupCI extends CI {
  modelValue;
}
export interface CheckboxCI extends CI {
  resolveEvent: Function;
  value: string;
  modelValue: string;
  onChange: Function;
}

export interface CascaderCI extends CI {
  modelValue;
  clearable;
  fieldNames: Function;
}

export type TabsCI = CI;
export type TabPaneCI = CI;
export interface CollapseCI extends CI {
  modelValue;
  keyName;
}
export type CollapseItemCI = CI;
export interface SwitchCI extends CI {
  modelValue;
  activeColor;
  activeValue;
  activeText;
  inactiveText;
  inactiveColor;
  inactiveValue;
}
export interface MessageCI extends CI {
  open;
  success;
  error;
  warn;
  info;
  instance:any;
  getInstance?:any
}

export type MessageBoxContextType = {
  title?: string;
  message?;
  confirmButtonText?;
  cancelButtonText?;
  type?;
};
export type MessageBoxOpenType = (context: MessageBoxContextType) => Promise<void>;
export interface MessageBoxCI extends CI {
  open: MessageBoxOpenType;
  confirm: MessageBoxOpenType;
  instance:any;
  getInstance?:any
}
export interface NotificationCI extends CI {
  open;
  success;
  error;
  warn;
  info;
  instance:any;
  getInstance?:any
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

export interface FormWrapperCI extends CI {
  visible: string;
  buildOnClosedBind: (is, onClose: Function) => {};
  customClass: string;
  titleSlotName: string;
  buildWidthBind: (is, width: any) => {};
  buildInitBind: (is) => {};
  buildInnerBind: (opts: any) => {};
  hasContentWrap?: (is) => string|undefined;
}
export interface DatePickerCI extends CI {
  modelValue;
  buildDateType: Function;
}
export interface TimePickerCI extends CI {
  modelValue;
}
export interface DropdownCI extends CI {
  command: Function;
  slotName;
  /**
   * 选项的渲染模式，slot or config
   */
  renderMode: string;
  value?: string;
  label?: string;
  children?: string;
}
export interface DropdownMenuCI extends CI {
  command: Function;
}
export interface DropdownItemCI extends CI {
  command;
}
export type ImageGroupCI = CI;
export interface ImageCI extends CI {
  buildPreviewList;
}
export type ProgressCI = CI;
export interface LoadingCI extends CI {
  name;
  type;
}
export interface UploadCI extends CI {
  name;
  type;
  typeImageCard: string;
  typeImage: string;
  getStatusFromEvent;
  getFileListFromEvent;
  status;
  limitAdd;
}
export interface ButtonCI extends CI {
  name: string;
  textType: Object;
  linkType: Object;
  colors: (type: string) => any;
  circle: Object;
}
export interface PaginationCI extends CI {
  name;
  currentPage;
  onChange;
  total;
  pageCount;
}

export interface DividerCI extends CI {
  name;
}

export interface PopoverCI extends CI {
  name;

  /**
   * 内容插槽
   */
  contentSlotName;

  referenceSlotName;
  visible;
}

export interface Icons {
  refresh;
  search;
  compact;
  columnsFilter;
  add;
  edit;
  remove;
  export;
  check;
  sort;
  close;
  left;
  right;
  arrowLeft;
  arrowRight;
  more;
  plus;
  zoomIn;
  zoomOut;
  refreshLeft;
  refreshRight;
  upload;
  fullScreen;
  unFullScreen;
  question;
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
