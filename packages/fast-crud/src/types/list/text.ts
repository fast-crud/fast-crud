import { uiContext } from '../../ui'
export default function () {
  const ui = uiContext.get()
  return {
    text: {
      search: { component: { clearable: true } },
      form: { component: { name: ui.input.name, clearable: true } }
    },
    'text-area': {
      search: { component: { type: 'text', clearable: true } },
      form: {
        component: {
          name: ui.textArea.name,
          type: ui.textArea.type,
          clearable: true
        },
        style: {
          'grid-column': 'span 2' // 跨2列
        }
      }
    }
  }
}
