<template>
  <component :is="computedUploaderImpl" ref="uploaderImplRef" />
</template>
<script>
import { getCurrentInstance, computed, ref } from "vue";
import { useUploader } from "./utils";

export default {
  name: "FsUploader",
  props: {
    type: {}
  },
  setup(props) {
    const uploaderImplRef = ref();
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
};
</script>
