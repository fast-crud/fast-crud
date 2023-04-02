<script lang="tsx">
import { UiSlot } from "../ui-interface";
import { defineComponent, PropType } from "vue";

interface UiRenderProps {
  renderFn: UiRenderFn;
}

type UiRenderFn = () => UiSlot;
export default defineComponent({
  name: "FsUiRender",
  props: {
    renderFn: {
      type: Function as PropType<UiRenderFn>,
      default() {
        return () => {
          return null;
        };
      }
    }
  },
  setup(props: UiRenderProps) {
    return () => {
      return props.renderFn();
    };
  }
});
</script>

<style lang="less"></style>
