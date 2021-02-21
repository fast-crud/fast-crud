export default {
  cascader: {
    search: { disabled: true, component: { value: []/* 修复重置表单时返回[null]的bug */, props: { elProps: { clearable: true } } } },
    form: { component: { name: 'cascade-select', props: { elProps: { filterable: true, disabled: false } } } },
    component: { name: 'cascade-format', props: { multiple: false } }
  },
  'cascader-multi': {
    search: { disabled: true, component: { value: [], props: { elProps: { clearable: true } } } },
    form: { component: { name: 'cascade-select', props: { elProps: { filterable: true, disabled: false, props: { multiple: true }, collapseTags: true } } } },
    component: { name: 'cascade-format', props: { multiple: true } }
  }
}
