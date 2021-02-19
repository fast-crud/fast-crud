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
    },
    dict: {
    }
  },
  setup (props, context) {
    const baseAttrs = {
      scope: props.scope,
      ...context.attrs,
      dict: props.dict
    }

    const attrs = {
      ...baseAttrs
    }
    if (props.valueBinding) {
      if (typeof props.valueBinding === 'string') {
        _.set(attrs, props.valueBinding, baseAttrs.modelValue)
      } else {
        // eslint-disable-next-line vue/no-setup-props-destructure
        const prop = props.valueBinding.prop
        // eslint-disable-next-line vue/no-setup-props-destructure
        const handle = props.valueBinding.handle
        _.set(attrs, prop, handle({ value: baseAttrs.modelValue }))
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
        return handler({ ...props.scope, $event, ...baseAttrs })
      }
    })

    if (props.dict?.options) {
      // eslint-disable-next-line vue/no-setup-props-destructure
      const dictOpts = props.dict.options
      if (dictOpts?.url || dictOpts?.getData) {
        console.log('dict', props.dict)
        props.dict.getDictData(props.scope)
      }
    }

    const childrenRender = () => {
      const children = {}
      _.forEach(props.children, (item, key) => {
        if (item instanceof Function) {
          children[key] = () => {
            return item({ ...props.scope, ...baseAttrs })
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
