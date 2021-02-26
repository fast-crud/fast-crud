import { uiContext } from '../../ui'
export default function () {
  const ui = uiContext.get()
  return {
    text: {
      search: { component: { [ui.input.clearable]: true } },
      form: { component: { name: ui.input.name, [ui.input.clearable]: true } }
    },
    'text-area': {
      search: { component: { name: ui.input.name, type: 'text', [ui.input.clearable]: true } },
      form: {
        component: {
          name: ui.textArea.name,
          type: ui.textArea.type,
          [ui.input.clearable]: true
        },
        style: {
          'grid-column': 'span 2' // 跨2列
        }
      }
    }
  }
}
