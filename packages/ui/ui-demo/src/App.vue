<script setup lang="ts">
import { RouterView} from 'vue-router'
import Application from "@/components/Application.vue";
</script>

<template>
  <a-config-provider >
  <NConfigProvider>
    <Application>
        <RouterView />
    </Application>
  </NConfigProvider>
  </a-config-provider>
</template>

<style lang="less">

</style>
