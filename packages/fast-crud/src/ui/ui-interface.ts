export interface CI {
  name;
}
export interface SelectCI extends CI {
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
export interface TextAreaCI extends CI {
  type;
  clearable;
  modelValue;
}

export interface DialogCI extends CI {
  visible;
  footer: Function;
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

export interface CheckboxCI extends CI {
  resolveEvent: Function;
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
export type MessageBoxOpenType = (
  context: MessageBoxContextType
) => Promise<void>;
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
}

export interface FormWrapperCI extends CI {
  visible: string;
  buildOnClosedBind: (is, Function) => {};
  customClass: string;
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
}
export interface UiInterface {
  modelValue: string;
  type: string;
  input: InputCI;
  textArea: TextAreaCI;
  tag: TagCI;
  table: TableCI;
  tableColumn: TableColumnCI;
  tableColumnGroup: TableColumnCI;
  pagination: CI;
  button: CI;
  form: CI;
  formItem: FormItemCI;
  radioGroup: RadioGroupCI;
  radio: RadioCI;
  select: SelectCI;
  option: CI;
  collapseTransition: CI;
  checkbox: CheckboxCI;
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
}
