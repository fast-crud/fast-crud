export default {
  text: {
    form: { component: { name: 'el-input', clearable: true } }
  },
  'text-area': {
    search: { component: { type: 'text', clearable: true } },
    form: {
      component: {
        name: 'el-input',
        type: 'textarea',
        clearable: true
      },
      style: {
        'grid-column': 'span 2' // 跨2列
      }
    }
  }
}
