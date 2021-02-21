export interface CI{
  name;
}

export interface TextAreaCI extends CI{
  type;
}
export interface UiInterface {
  input: CI;
  textArea: TextAreaCI;
  tag: CI;
}
