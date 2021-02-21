<script>
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
  render () {
    return this.renderFunc({ scope: this.scope, ...this.$attrs })
  }
}
</script>
