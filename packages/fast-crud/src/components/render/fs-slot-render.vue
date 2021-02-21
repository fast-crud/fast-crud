<script>
import { h } from 'vue'
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
    // console.log('props.slots', props.slots, props.scope)
    return () => h(props.slots, props.scope)
  }
}
</script>
