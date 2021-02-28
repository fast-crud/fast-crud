import { resolveComponent, getCurrentInstance, ref } from 'vue'
import _ from 'lodash-es'
import FsRowHandle from './fs-row-handle.vue'
import FsComponentRender from '../render/fs-component-render'
import { ComputeValue } from '../../core/compute-value'
import './fs-table.less'
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
    const tableColumnCI = proxy.$fsui.tableColumn
    if (templateMode) {
      const tableColumnComp = resolveComponent(tableColumnCI.name)
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
                if (subColumn.show === false) {
                  return
                }
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
                  const row = scope[tableColumnCI.row]
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
                    modelValue: scope[tableColumnCI.row][item.key],
                    'onUpdate:modelValue': (value) => {
                      scope[tableColumnCI.row][item.key] = value
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
        _.forEach(this.columns, (item) => {
          if (item.show === false) {
            return
          }
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
    const dataSource = {
      [proxy.$fsui.table.data]: this.data
    }

    // console.log('this.fixedHeight', this.fixedHeight)
    return <tableComp ref={'tableRef'}
      {...this.$attrs}
      {...dataSource}
      v-slots={tableSlots}/>
  },
  setup () {
    const tableRef = ref()
    return {
      tableRef
    }
  },
  methods: {
    onRowHandle (context) {
      this.$emit('rowHandle', context)
    }
  }
}
