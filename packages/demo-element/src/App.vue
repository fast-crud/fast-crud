<template>
  <router-view v-if="routerEnabled" />
</template>

<script>
import { utils } from "@fast-crud/fast-crud";
import { nextTick, ref, provide } from "vue";
export default {
  name: "App",
  setup() {
    utils.trace.trace();
    const routerEnabled = ref(true);
    async function reload() {
      routerEnabled.value = false;
      await nextTick();
      routerEnabled.value = true;
    }
    provide("fn:router.reload", reload);

    return {
      routerEnabled
    };
  },
  renderTracked({ key, target, type }) {
    console.log("tracked", this.name, { key, target, type });
  },
  renderTriggered({ key, target, type }) {
    console.log("triggerd", this.name, { key, target, type });
  }
};
</script>
