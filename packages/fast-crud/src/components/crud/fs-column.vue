<script>
import { computed, h } from 'vue'
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
    column: {
      type: Object
    },
    prop: {
      type: String,
      required: true
    },
    slots: {
      type: Object
    }
  },
  setup (props) {
    traceUtil.trace('fs-column')
    function getContextFn () {
      return {}
    }

    const computedColumn = computed(() => {
      const target = { ...props.column }
      delete target.children // 这里必须删除掉children
      delete target.component
      return ComputeValue.buildBindProps(target, getContextFn)
    })

    const computedChildren = computed(() => {
      return props.column.children
    })

    let slots = null
    if (computedChildren.value != null) {
      slots = {
        default () {
          const children = []
          _.forEach(computedChildren.value, (item, key) => {
            children.push(<fs-column column={item} key={key} prop={key} slots={props.slots}/>)
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
    } else if (props.column.component) {
      slots = {
        default: (scope) => {
          if (scope.$index === -1) {
            return
          }
          function getScope () {
            return { key: props.prop, ...scope }
          }
          const newScope = getScope()
          const component = ComputeValue.buildBindProps(props.column.component, getScope)
          if (component.show === false) {
            return
          }
          if (props.column.component.render) {
            return props.column.component.render(newScope)
          }
          return <fs-component-render v-model={scope.row[props.prop]} {...props.column.component} scope={newScope} />
        }
      }
    }
    return () => {
      if (computedColumn.value.show === false) {
        return
      }
      return <el-table-column
        {...computedColumn.value}
        prop={props.prop} v-slots={slots} />
    }
  }
}
</script>
