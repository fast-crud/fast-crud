<template>
  <div class="fs-source-link-group" v-if="showSourceLink">
    <div class="fs-source-link" @click="goSource('https://gitee.com')">本页源码（Gitee）</div>
    <div class="fs-source-link" @click="goSource('https://github.com')">本页源码（Github）</div>
  </div>
</template>

<script>
import { defineComponent, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
export default defineComponent({
  name: "SourceLink",
  setup() {
    const router = useRouter();
    const showSourceLink = ref(false);
    watch(
      () => {
        return router.currentRoute.value.fullPath;
      },
      (value) => {
        showSourceLink.value = value !== "/index";
      },
      { immediate: true }
    );
    const middle = "/fast-crud/fast-crud/tree/main/packages/fast-admin/demo-element/src/views";
    function goSource(prefix) {
      const path = router.currentRoute.value.fullPath;
      window.open(prefix + middle + path + "/index.vue");
    }
    return {
      goSource,
      showSourceLink
    };
  }
});
</script>

<style lang="less">
.fs-source-link-group {
  position: fixed;
  right: 3px;
  bottom: 20px;
  .fs-source-link {
    text-align: center;
    cursor: pointer;
    font-size: 12px;
    border-radius: 5px 0 0 5px;
    padding: 5px;
    background: #666;
    color: #fff;
    margin-bottom: 5px;
  }
}
</style>
