import { TextAreaCI, CI, UiInterface } from './ui-interface'
export class Element implements UiInterface {
  textArea: TextAreaCI ={
    name: 'el-input',
    type: 'textarea'
  };

  tag: CI ={
    name: 'el-tag'
  };

  input: CI={
    name: 'el-input'
  }
}
