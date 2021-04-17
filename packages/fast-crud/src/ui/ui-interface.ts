export interface CI {
  name;
}
export interface SelectCI extends CI {
  modelValue;
  clearable;
}
export interface TreeSelectCI extends CI {
  modelValue;
  clearable;
}
export interface RadioCI extends CI {
  value;
}
export interface RadioGroupCI extends CI {
  modelValue;
}
export interface InputCI extends CI {
  clearable;
  modelValue;
}
export type InputGroupCI = CI;
export interface InputPasswordCI extends InputCI {
  showPassword;
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
}

export interface DrawerCI extends CI {
  visible;
  customClass;
  width;
}

export interface TableColumnCI extends CI {
  label;
  prop;
  row;
  index;
}

export interface TableCI extends CI {
  data;
  fixedHeaderNeedComputeBodyHeight;
  vLoading;
}

export interface CheckboxGroupCI extends CI {
  modelValue;
}
export interface CheckboxCI extends CI {
  resolveEvent: Function;
  value;
  modelValue;
}

export interface CascaderCI extends CI {
  modelValue;
  clearable;
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
  get;
  open;
  success;
  error;
  warn;
  info;
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
  get;
  open: MessageBoxOpenType;
  confirm: MessageBoxOpenType;
}
export interface NotificationCI extends CI {
  get;
  open;
  success;
  error;
  warn;
  info;
}
export interface IconCI extends CI {
  isComponent: boolean;
  circle: Record<string, any>;
}
export interface FormItemCI extends CI {
  prop: string;
  label: string;
}

export interface TagCI extends CI {
  type: string;
  colors: Array<string>;
}

export interface FormWrapperCI extends CI {
  visible: string;
  buildOnClosedBind: (is, Function) => {};
  customClass: string;
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
  getStatusFromEvent;
  getFileListFromEvent;
  status;
  limitAdd;
}
export interface ButtonCI extends CI {
  name;
  text;
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
  pagination: CI;
  button: ButtonCI;
  form: CI;
  formItem: FormItemCI;
  radioGroup: RadioGroupCI;
  radio: RadioCI;
  checkboxGroup: CheckboxGroupCI;
  checkbox: CheckboxCI;
  select: SelectCI;
  treeSelect: TreeSelectCI;
  option: CI;
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
}
