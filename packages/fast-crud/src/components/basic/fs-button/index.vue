<script>
import { resolveComponent, h } from 'vue'
export default {
  name: 'fs-button',
  props: {
    text: {
      type: String,
      default: '',
      required: false
    },
    icon: {},
    circle: {}
  },
  render () {
    let icon = this.icon
    let IconComp = null
    if (icon && this.$fsui.icon.isComponent) {
      IconComp = resolveComponent(icon)
      icon = null
    }
    const slots = {
      ...this.$slots,
      default: () => {
        const children = []
        if (IconComp) {
          children.push(<IconComp/>)
        }
        if (this.$slots.default) {
          children.push(this.$slots.default)
        } else if (this.text) {
          children.push(this.text)
        }
        return children
      }
    }

    const isCircle = this.circle ? this.$fsui.icon.circle : {}

    const comp = resolveComponent(this.$fsui.button.name)

    return h(comp, {
      ...this.$attrs,
      ...isCircle,
      icon,
      class: {
        'fs-button': true,
        'is-thin': !this.text && !this.$slots.default
      }
    }, slots)
  }
}

</script>
<style lang="less">
.fs-button{
  &.is-thin{
    &.el-button--small, &.el-button--small.is-round {
      padding: 9px 9px;
    }
    &.el-button--mini, &.el-button--mini.is-round {
      padding: 7px 7px;
    }
    &.el-button [class*=el-icon-]+span {
      margin-left: 0;
    }
  }

  &.ant-btn{
    line-height: 0;
  }
  &.ant-btn > .anticon{
    line-height:0;
  }
}

</style>
