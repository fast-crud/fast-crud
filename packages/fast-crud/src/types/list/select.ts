export default {
  select: {
    search: { autoSearchTrigger: 'change' },
    column: { component: { name: 'fs-values-format' } },
    form: { component: { name: 'fs-dict-select', clearable: true } }
  },
  radio: {
    search: { component: { name: 'fs-dict-select', clearable: true }, autoSearchTrigger: 'change' },
    form: { component: { name: 'fs-dict-radio' } },
    column: { component: { name: 'fs-values-format' } }
  },
  checkbox: {
    search: { component: { name: 'fs-dict-select', clearable: true, multiple: true }, autoSearchTrigger: 'change' },
    form: { component: { name: 'fs-dict-checkbox' } },
    column: { component: { name: 'fs-values-format' } }
  },
  'dict-switch': {
    search: { component: { name: 'fs-dict-switch', clearable: true, multiple: true }, autoSearchTrigger: 'change' },
    form: { component: { name: 'fs-dict-switch' } },
    column: { component: { name: 'fs-values-format' } }
  }
}
