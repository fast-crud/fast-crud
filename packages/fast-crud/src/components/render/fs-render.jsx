import traceUtil from '../../utils/util.trace'
export default {
  name: 'fs-render',
  functional: true,
  props: {
    renderFunc: {
      type: Function
    },
    scope: {
      type: Object
    }
  },
  setup () {
    traceUtil.trace('fs-render')
  },
  render () {
    return this.renderFunc({ scope: this.scope, ...this.$attrs })
  }
}
