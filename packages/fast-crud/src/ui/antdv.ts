import { ComponentInterface, UiInterface } from './ui-interface'
export class Antdv implements UiInterface {
  textArea: ComponentInterface={ name: 'a-textarea' };
  tag: ComponentInterface = {
    name: 'a-tag'
  };

  input= {
    name: 'a-input'
  }
}
