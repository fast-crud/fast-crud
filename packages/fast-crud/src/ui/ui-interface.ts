export interface CI{
  name;
}

export interface TextAreaCI extends CI{
  type;
}

export interface DialogCI extends CI{
  visible;
}
export interface UiInterface {
  input: CI;
  textArea: TextAreaCI;
  tag: CI;
  table: CI;
  tableColumn: CI;
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

}
