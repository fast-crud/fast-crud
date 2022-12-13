<style lang="less">
.fs-table-columns-fixed-controller {
  .fs-button {
    padding: 2px !important;
    font-size: 10px;
    min-height: auto;
  }
}
</style>

<template>
  <component :is="$fsui.buttonGroup.name" class="fs-table-columns-fixed-controller">
    <fs-button
      v-for="option of options"
      :key="option.icon"
      :type="modelValue === option.value ? 'primary' : 'default'"
      :icon="option.icon"
      size="small"
      @click="submit(option.value)"
    />
  </component>
</template>

<script>
export default {
  name: "FsTableColumnsFixedController",
  props: {
    modelValue: {
      default: false
    }
  },
  emits: ["update:modelValue", "change"],
  data() {
    return {
      options: [
        {
          value: "left",
          icon: this.$fsui.icons.left // 'el-icon-arrow-left'
        },
        {
          value: false,
          icon: this.$fsui.icons.close // 'el-icon-close'
        },
        {
          value: "right",
          icon: this.$fsui.icons.right // 'el-icon-arrow-right'
        }
      ]
    };
  },
  methods: {
    submit(value) {
      this.$emit("update:modelValue", value);
      this.$emit("change", value);
    }
  }
};
</script>
