<script>
import { h } from 'vue'
import traceUtil from '../../utils/util.trace'
export default {
  name: 'fs-slot-render',
  props: {
    slots: {
      type: Function
    },
    scope: {
      type: Object
    }
  },
  setup (props) {
    traceUtil.trace('fs-slot-render')
    // console.log('props.slots', props.slots, props.scope)
    return () => h(props.slots, props.scope)
  }
}
</script>
