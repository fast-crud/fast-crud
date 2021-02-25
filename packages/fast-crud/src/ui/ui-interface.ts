export interface CI{
  name;
}

export interface TextAreaCI extends CI{
  type;
}

export interface DialogCI extends CI{
  visible;
}

export interface TableColumnCI extends CI{
  label;
  prop;
}

export interface TableCI extends CI{
  data;
}
export interface IconCI extends CI{
  isComponent: boolean;
  circle: Record<string, any>;
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
}
export interface UiInterface {
  type: string;
  input: CI;
  textArea: TextAreaCI;
  tag: CI;
  table: TableCI;
  tableColumn: TableColumnCI;
  tableColumnGroup: TableColumnCI;
  pagination: CI;
  button: CI;
  form: CI;
  formItem: CI;
  radioGroup: CI;
  radio: CI;
  select: CI;
  option: CI;
  collapseTransition: CI;
  checkbox: CI;
  card: CI;
  drawer: CI;
  col: CI;
  row: CI;
  buttonGroup: CI;
  dialog: DialogCI;
  icon: IconCI;
  icons: Icons;

}
