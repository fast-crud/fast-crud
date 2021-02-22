// export default {
//   // eslint-disable-next-line @typescript-eslint/no-empty-function
//   trace () {
//   }
// }

import { onRenderTracked, onRenderTriggered } from 'vue'
export default {
  trace () {
    onRenderTracked((event) => {
      console.log('状态跟踪----------->', event.key, event.target.name, event)
    })
    onRenderTriggered((event) => {
      console.log('状态触发--------------->', event.key, event)
    })
  }
}
