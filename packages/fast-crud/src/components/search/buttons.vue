<template>
  <div class="fs-search-col fs-search-btns">
    <component :is="$fsui.formItem.name">
      <template v-for="(item, index) in buttons" :key="index">
        <fs-button v-if="item.show" v-bind="item" @click="item.click()" />
      </template>
    </component>
  </div>
</template>
<script>
export default {
  name: "FsSearchButtons",
  inheritAttrs: false,
  props: {
    buttons: {
      type: Object
    }
  }
};
</script>
