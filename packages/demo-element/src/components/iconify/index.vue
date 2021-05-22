<template>
  <span class="iconify" :data-icon="icon" :data-inline="inline"></span>
</template>

<script>
import { defineComponent } from "vue";
export default defineComponent({
  name: "Iconify",
  props: {
    icon: {},
    inline: {
      default: false
    }
  },
  setup(props) {}
});
</script>
