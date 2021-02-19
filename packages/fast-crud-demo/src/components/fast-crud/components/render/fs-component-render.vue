<script>
import { h, resolveComponent } from 'vue'
import _ from 'lodash-es'
export default {
  name: 'fs-component-render',
  props: {
    name: {
      type: String,
      default: 'el-input'
    },
    children: {
      type: Object
    },
    on: {
      type: Object
    },
    events: {
      type: Object
    },
    scope: {
      type: Object
    },
    valueBinding: {
      type: String, Object
    }
  },
  setup (props, context) {
    const attrs = {
      scope: props.scope,
      ...context.attrs
    }

    if (props.valueBinding) {
      if (typeof props.valueBinding === 'string') {
        _.set(attrs, props.valueBinding, attrs.modelValue)
      } else {
        // eslint-disable-next-line vue/no-setup-props-destructure
        const prop = props.valueBinding.prop
        // eslint-disable-next-line vue/no-setup-props-destructure
        const handle = props.valueBinding.handle
        _.set(attrs, prop, handle({ value: attrs.modelValue }))
      }
    }

    const events = { ...props.events, ...props.on }
    _.forEach(events, (value, key) => {
      let handler = value
      if (typeof value === 'string') {
        // eslint-disable-next-line no-eval
        handler = eval(value)
      }
      attrs[key] = ($event) => {
        return handler({ ...props.scope, $event, props: context.attrs })
      }
    })

    const childrenRender = () => {
      const children = {}
      _.forEach(props.children, (item, key) => {
        if (item instanceof Function) {
          children[key] = () => {
            return item(props.scope)
          }
        } else {
          children[key] = () => {
            return item
          }
        }
      })
      return children
    }

    const comp = resolveComponent(props.name)
    return () => {
      return h(comp, attrs, childrenRender())
    }
  }
}
</script>
