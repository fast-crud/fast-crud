<script lang="ts">
import { defineComponent } from "vue";
import { useUploader } from "./utils";
import { loadUploader } from "./libs";

export default defineComponent({
  name: "FsUploader",
  props: {
    type: {}
  },
  setup(props) {
    async function getUploaderRef() {
      const { getDefaultType } = useUploader();
      const type = props.type || getDefaultType();
      return await loadUploader(type as string);
    }

    return {
      getUploaderRef
    };
  }
});
</script>
