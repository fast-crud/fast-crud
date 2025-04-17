<script lang="ts">
import { defineComponent } from "vue";
import { useUploader } from "./utils";
import { loadUploader } from "./libs";

/**
 * 请查看对应上传类型文档：FsUploaderForm、FsUploaderCos、FsUploaderAlioss、FsUploaderS3、FsUploaderQiniu
 */
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
