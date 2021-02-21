import { Element } from './element'
import { Antdv } from './antdv'
import { UiInterface } from './ui-interface'
export class UiContext {
  ref: UiInterface = new Element();
  set (name) {
    if (name === 'antdv') {
      this.ref = new Antdv()
    } else {
      this.ref = new Element()
    }
  }

  get () {
    return this.ref
  }
}
export const uiContext = new UiContext()
export default function () {
  return uiContext.get()
}
