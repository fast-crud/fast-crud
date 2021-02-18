<script>
import { computed } from 'vue'
import FsCell from './fs-cell'
import _ from 'lodash-es'
import { ComputeValue } from '@/components/fast-crud/core/compute-value'
export default {
  name: 'fs-column',
  components: { FsCell },
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
  setup (props, ctx) {
    console.log('ctx', ctx)
    const dependContext = {}
    function getContextFn () {
      return dependContext
    }
    const computedColumn = computed(() => {
      const target = _.cloneDeep(props.column)
      delete target.children
      delete target.component
      return ComputeValue.buildBindProps(target, getContextFn)
    })

    const computedChildren = computed(() => {
      return props.column.children
    })

    return () => {
      if (computedColumn.value.show === false) {
        return
      }
      const prop = props.prop
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
      } else if (props.slots && props.slots['cell-' + prop]) {
        slots = {
          default: (scope) => {
            const newScope = { key: prop, ...scope }
            return <fs-slot-render slots={props.slots['cell-' + prop]} scope={newScope}/>
          }
        }
      } else if (props.column.component) {
        slots = {
          default: (scope) => {
            const newScope = { key: prop, ...scope }
            return <fs-cell column={props.column} prop={prop} scope={newScope} />
          }
        }
      }
      return <el-table-column
        {...computedColumn.value}
        prop={prop} v-slots={slots} />
    }
  }
}
</script>
