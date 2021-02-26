<script>
import { h, resolveComponent, getCurrentInstance, ref, toRef, computed, reactive } from 'vue'
import _ from 'lodash-es'
import traceUtil from '../../utils/util.trace'
import { uiContext } from '../../ui'
export default {
  name: 'fs-component-render',
  emits: ['update:dict', 'update:modelValue'],
  props: {
    modelValue: {},
    name: {
      type: String
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
    traceUtil.trace('fs-component-render')
    const ui = uiContext.get()
    const newScope = computed(() => {
      return {
        ...ctx.attrs,
        ...props.scope,
        dict: props.dict
      }
    })

    // 带事件的attrs
    const allAttrs = {
      scope: props.scope,
      dict: props.dict,
      modelValue: props.modelValue
    }
    const computedModelValue = computed(() => {
      return props.modelValue
    })
    const valueBinding = computed(() => {
      return props.valueBinding || ui.modelValue
    })
    allAttrs['onUpdate:' + valueBinding.value] = (value) => {
      ctx.emit('update:modelValue', value)
    }

    const events = { ...props.events, ...props.on }
    _.forEach(events, (value, key) => {
      let handler = value
      if (typeof value === 'string') {
        // eslint-disable-next-line no-eval
        handler = eval(value)
      }
      allAttrs[key] = ($event) => {
        return handler({ ...newScope.value, $event })
      }
    })

    const childrenRender = () => {
      const children = {}
      _.forEach(props.children, (item, key) => {
        if (item instanceof Function) {
          children[key] = () => {
            return item(newScope.value)
          }
        } else {
          children[key] = () => {
            return item
          }
        }
      })
      return children
    }
    const { proxy } = getCurrentInstance()
    // eslint-disable-next-line vue/no-setup-props-destructure
    let comp = props.name || proxy.$fsui.input.name
    if (comp !== 'div' || comp !== 'span') {
      comp = resolveComponent(comp)
    }
    const children = childrenRender()
    return () => {
      _.set(allAttrs, valueBinding.value, computedModelValue.value)
      return h(comp, allAttrs, children)
    }
  }
}
</script>
