<template>
  {{ data }}

  <a-sub :table="data.table" />
</template>

<script>
import { defineComponent, reactive, ref } from "vue";
import ASub from "./sub.vue";
class AsyncLoader {
  constructor() {
    this.data = undefined;
  }

  loadFromRemote() {
    setTimeout(() => {
      this.data = ["this is from remote "];
    }, 1000);
  }
}
export default defineComponent({
  name: "FormBugTest",
  components: { ASub },
  setup() {
    const asyncLoader = new AsyncLoader();
    const asyncReactiveData = reactive(asyncLoader);
    asyncReactiveData.loadFromRemote();
    const data = ref();
    const raw = {
      table: {},
      asyncLoader: asyncReactiveData
    };

    raw.table.inArray = [];
    raw.table.inArray.push({ test: asyncReactiveData });

    data.value = raw;
    return {
      data
    };
  }
});
</script>
