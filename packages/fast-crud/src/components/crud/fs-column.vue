<script>
import { computed, h, resolveComponent, getCurrentInstance } from 'vue'
import FsCell from './fs-cell'
import _ from 'lodash-es'
import { ComputeValue } from '../../core/compute-value'
import FsRender from '../render/fs-render'
import traceUtil from '../../utils/util.trace'
import FsComponentRender from '../../components/render/fs-component-render'

export default {
  name: 'fs-column',
  components: { FsComponentRender, FsCell, FsRender },
  props: {
    component: {
      type: Object
    },
    slots: {
      type: Object
    },
    prop: {

    },
    key: {
    // 不要用它
    },
    title: {

    },
    children: {

    },
    show: {

    }
  },
  setup (props, ctx) {
    traceUtil.trace('fs-column')
    function getContextFn () {
      return {}
    }

    const computedChildren = computed(() => {
      return props.children
    })

    let slots = null
    if (computedChildren.value != null) {
      slots = {
        default () {
          const children = []
          _.forEach(computedChildren.value, (item) => {
            children.push(<fs-column {...item} prop={item.key} slots={props.slots}/>)
          })
          return children
        }
      }
    } else if (props.slots && props.slots['cell-' + props.prop]) {
      slots = {
        default: (scope) => {
          const newScope = { key: props.prop, ...scope }
          return h(props.slots['cell-' + props.prop], newScope)
        }
      }
    } else if (props.component) {
      slots = {
        default: (scope) => {
          if (scope?.$index === -1) {
            return
          }
          function getScope () {
            return { key: props.prop, ...scope }
          }
          const newScope = getScope()
          const component = ComputeValue.buildBindProps(props.component, getScope)
          if (component.show === false) {
            return
          }
          if (props.component.render) {
            return props.component.render(newScope)
          }
          return <fs-component-render v-model={scope.row[props.prop]} {...props.component} scope={newScope} />
        }
      }
    }

    const { proxy } = getCurrentInstance()
    return () => {
      if (props.show === false) {
        return
      }
      const tableColumnComp = resolveComponent(proxy.$fsui.tableColumn.name)
      return <tableColumnComp
        {...ctx.attrs}
        label={props.title} prop={props.prop} v-slots={slots} />
    }
  }
}
</script>
