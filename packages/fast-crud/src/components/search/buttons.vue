<template>
  <div class="fs-search-col fs-search-btns">
    <component :is="ui.formItem.name">
      <template v-for="(item, index) in buttons" :key="index">
        <fs-button v-if="item.show" v-bind="item" @click="item._click()" />
      </template>
    </component>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { useUi } from "../../use";

export default defineComponent({
  name: "FsSearchButtons",
  inheritAttrs: false,
  props: {
    buttons: {
      type: Object
    }
  },
  setup() {
    const { ui } = useUi();
    return { ui };
  }
});
</script>
