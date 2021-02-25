<script>
import { resolveComponent, getCurrentInstance } from 'vue'
import { uiContext } from '../../ui'
import _ from 'lodash-es'
import FsRowHandle from './fs-row-handle'
import FsComponentRender from '../render/fs-component-render'
import { ComputeValue } from '../../core/compute-value'
export default {
  name: 'fs-table',
  components: { FsComponentRender, FsRowHandle },
  emits: ['rowHandle'],
  props: {
    slots: {},
    columns: {},
    rowHandle: {},
    show: {},
    data: {}
  },
  render () {
    if (this.show === false) {
      return
    }
    const { proxy } = getCurrentInstance()
    const tableComp = resolveComponent(proxy.$fsui.table.name)

    const tableSlots = {}

    const templateMode = true
    if (templateMode) {
      const tableColumnComp = resolveComponent(proxy.$fsui.tableColumn.name)
      const tableColumnGroupComp = resolveComponent(proxy.$fsui.tableColumnGroup.name)

      tableSlots.default = () => {
        const children = []
        const buildColumn = (item) => {
          const cellSlots = {}
          let currentTableColumnComp = tableColumnComp
          if (item.children && item.children.length > 0) {
            cellSlots.default = () => {
              const subColumns = []
              _.forEach(item.children, (subColumn) => {
                subColumns.push(buildColumn(subColumn))
              })
              return subColumns
            }
            currentTableColumnComp = tableColumnGroupComp
          } else {
            if (this.slots && this.slots['cell-' + item.key]) {
              cellSlots.default = (scope) => {
                this.slots['cell-' + item.key](scope)
              }
            } else if (item.component) {
              cellSlots.default = (scope) => {
                function getContextFn () {
                  const row = scope.record || scope.row
                  return { ...scope, row }
                }
                const newScope = getContextFn()
                const component = ComputeValue.buildBindProps(item.component, getContextFn)
                if (component.show === false) {
                  return
                }
                if (item.component.render) {
                  return item.component.render(newScope)
                } else {
                  const vModel = {
                    modelValue: scope[proxy.$fsui.tableColumn.row][item.key],
                    'onUpdate:modelValue': (value) => {
                      console.log('onUpdate:modelValue', value)
                      scope[proxy.$fsui.tableColumn.row][item.key] = value
                    },
                    'onUpdate:value': (value) => {
                      console.log('onUpdate:value', value)
                      scope[proxy.$fsui.tableColumn.row][item.key] = value
                    },
                    input: (value) => {
                      console.log('input', value)
                      scope[proxy.$fsui.tableColumn.row][item.key] = value
                    }
                  }
                  return <fs-component-render {...component} {...vModel} scope={newScope}/>
                }
              }
            }
          }
          const newItem = { ...item }
          delete newItem.children

          return <currentTableColumnComp {...newItem} label={item.title} prop={item.key} dataIndex={item.key} v-slots={cellSlots}/>
        }
        _.forEach(this.columns, (item, index) => {
          children.push(buildColumn(item))
        })

        // rowHandle
        if (this.rowHandle && this.rowHandle.show !== false) {
          const rowHandleSlots = {
            default: (scope) => {
              return <fs-row-handle {...this.rowHandle} scope={scope} onHandle={this.onRowHandle}/>
            }
          }
          children.push(<tableColumnComp {...this.rowHandle}
            label={this.rowHandle.title}
            prop={this.rowHandle.key || 'rowHandle'}
            v-slots={rowHandleSlots}/>)
        }
        return children
      }
    }
    console.log('tableSlots', tableSlots)
    const dataSource = {
      [proxy.$fsui.table.data]: this.data
    }
    return <tableComp {...this.$attrs} {...dataSource} v-slots={tableSlots}/>
  },
  methods: {
    onRowHandle (context) {
      this.$emit('rowHandle', context)
    }
  }
}
</script>
