<script>
import { h, resolveComponent } from 'vue'
import _ from 'lodash-es'
import traceUtil from '../../utils/util.trace'
export default {
  name: 'fs-component-render',
  emits: ['update:dict'],
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
  setup (props, ctx) {
    traceUtil.trace()

    const newScope = {
      ...ctx.attrs,
      ...props.scope,
      dict: props.dict
    }
    const baseAttrs = {
      ...ctx.attrs,
      scope: props.scope,
      dict: props.dict
    }

    // 带事件的attrs
    const allAttrs = {
      ...baseAttrs
    }
    if (props.valueBinding) {
      if (typeof props.valueBinding === 'string') {
        _.set(allAttrs, props.valueBinding, baseAttrs.modelValue)
      } else {
        // eslint-disable-next-line vue/no-setup-props-destructure
        const prop = props.valueBinding.prop
        // eslint-disable-next-line vue/no-setup-props-destructure
        const handle = props.valueBinding.handle
        _.set(allAttrs, prop, handle({ value: baseAttrs.modelValue }))
      }
    }

    const events = { ...props.events, ...props.on }
    _.forEach(events, (value, key) => {
      let handler = value
      if (typeof value === 'string') {
        // eslint-disable-next-line no-eval
        handler = eval(value)
      }
      allAttrs[key] = ($event) => {
        return handler({ ...newScope, $event })
      }
    })

    const childrenRender = () => {
      const children = {}
      _.forEach(props.children, (item, key) => {
        if (item instanceof Function) {
          children[key] = () => {
            return item(newScope)
          }
        } else {
          children[key] = () => {
            return item
          }
        }
      })
      return children
    }

    // eslint-disable-next-line vue/no-setup-props-destructure
    let comp = props.name
    if (props.name !== 'div') {
      comp = resolveComponent(props.name)
    }

    return () => {
      return h(comp, allAttrs, childrenRender())
    }
  }
}
</script>
