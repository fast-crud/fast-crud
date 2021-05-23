<template>
  <a-config-provider :locale="locale">
    <router-view v-if="routerEnabled" />
  </a-config-provider>
</template>

<script>
import { utils } from "@fast-crud/fast-crud";
import zhCN from "ant-design-vue/es/locale/zh_CN";
import { provide, ref, nextTick } from "vue";
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
  data() {
    return {
      locale: zhCN
    };
  },
  renderTracked({ key, target, type }) {
    console.log("tracked", "app", { key, target, type });
    /* 当组件第一次渲染时，这将被记录下来:
    {
      key: "cart",
      target: {
        cart: 0
      },
      type: "get"
    }
    */
  },
  renderTriggered({ key, target, type }) {
    console.log("triggerd", "app", { key, target, type });
  }
};
</script>
