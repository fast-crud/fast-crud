import './style.less'

export default {
  name: 'fs-button',
  render () {
    const button =
      <el-button
        { ...{ attrs: this.$attrs } }
        class={
          {
            'fs-button': true,
            'is-thin': !this.text && !this.$slots.default
          }
        }
        >
        { this.$slots.default ? this.$slots.default : this.text}
      </el-button>
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
