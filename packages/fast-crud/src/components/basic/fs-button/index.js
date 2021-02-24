import './style.less'
import { resolveComponent } from 'vue'
export default {
  name: 'fs-button',
  render () {
    const comp = resolveComponent(this.$fsui.button.name)
    const button =
      <comp
        { ...{ attrs: this.$attrs } }
        class={
          {
            'fs-button': true,
            'is-thin': !this.text && !this.$slots.default
          }
        }
      >
        { this.$slots.default ? this.$slots.default : this.text}
      </comp>
    return button
  },
  props: {
    text: {
      type: String,
      default: '',
      required: false
    }
  }
}
