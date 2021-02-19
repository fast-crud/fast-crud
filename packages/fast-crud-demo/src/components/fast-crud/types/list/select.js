import _ from 'lodash-es'
export default {
  select: {
    search: {
      autoSearchTrigger: 'change'
    },
    form: {
      component: {
        name: 'el-select',
        clearable: true,
        children: {
          default (scope) {
            const arr = []
            if (scope?.dict?.data) {
              const dictData = scope.dict.data
              _.forEach(dictData, (item) => {
                arr.push(<el-option value={item.value} label={item.label}/>)
              })
            }
            return arr
          }
        }
      }
    }
  },
  radio: {
    form: { component: { name: 'dict-radio', props: { elProps: { disabled: false, readonly: false } } } },
    component: { name: 'values-format' }
  },
  checkbox: {
    search: { disabled: true, component: { name: 'dict-select', props: { clearable: true, multiple: true } } },
    form: { component: { name: 'dict-checkbox', props: { elProps: { disabled: false, readonly: false } } } },
    component: { name: 'values-format', props: {} }
  },
  'dict-switch': {
    search: { disabled: true, component: { name: 'dict-switch', props: { clearable: true, multiple: true } } },
    form: { component: { name: 'dict-switch', props: { elProps: { disabled: false, readonly: false } } } },
    component: { name: 'values-format', props: { elProps: { disabled: false, readonly: true } } }
  }
}
