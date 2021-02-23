// export default {
//   // eslint-disable-next-line @typescript-eslint/no-empty-function
//   trace () {
//   }
// }

import { onRenderTracked, onRenderTriggered } from 'vue'
export default {
  trace (name) {
    onRenderTracked((event) => {
      console.log('状态跟踪track----------->', name, event.key, event.target, event.type, event)
    })
    onRenderTriggered((event) => {
      console.log('状态触发trigger--------------->', name, event.key, event.target, event.type, event)
    })
  }
}
