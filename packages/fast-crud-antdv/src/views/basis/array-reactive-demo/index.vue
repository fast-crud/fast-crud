<template>
  <p>1.{{ remoteDict }}</p>
  <p>2.{{ crudOptions.search.columns.remote.component.dict }}</p>
  <p>3.{{ crudOptions.table.columns[2].component.dict }}</p>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
export default defineComponent({
  name: "FormBugTest",
  setup() {
    const asyncReactiveData = reactive();
    const date = reactive({
      arr: []
    });

    return {
      ...crud,
      crudRef,
      remoteDict
    };
  }
});
</script>
