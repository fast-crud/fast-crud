<template>
  <component :is="computedUploaderImpl" ref="uploaderImplRef" />
</template>
<script lang="ts">
import { getCurrentInstance, computed, ref, defineComponent, Ref } from "vue";
import { useUploader } from "./utils";

export default defineComponent({
  name: "FsUploader",
  props: {
    type: {}
  },
  setup(props) {
    const uploaderImplRef: Ref = ref();
    const computedUploaderImpl = computed(() => {
      const { proxy } = getCurrentInstance();
      const { getDefaultType, getUploaderImpl } = useUploader(proxy);
      const type = props.type || getDefaultType();
      return getUploaderImpl(type);
    });

    function getUploaderRef() {
      return uploaderImplRef.value;
    }

    return {
      uploaderImplRef,
      computedUploaderImpl,
      getUploaderRef
    };
  }
});
</script>
