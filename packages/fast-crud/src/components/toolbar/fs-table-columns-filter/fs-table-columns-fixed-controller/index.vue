<template>
  <component :is="ui.buttonGroup.name" class="fs-table-columns-fixed-controller">
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

<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import { useUi } from "../../../../use";

export default defineComponent({
  name: "FsTableColumnsFixedController",
  props: {
    modelValue: {
      default: false
    }
  },
  emits: ["update:modelValue", "change"],
  setup(props, ctx) {
    const { ui } = useUi();
    const options = computed(() => {
      return [
        {
          value: "left",
          icon: ui.icons.left // 'el-icon-arrow-left'
        },
        {
          value: false,
          icon: ui.icons.close // 'el-icon-close'
        },
        {
          value: "right",
          icon: ui.icons.right // 'el-icon-arrow-right'
        }
      ];
    });

    function submit(value: any) {
      ctx.emit("update:modelValue", value);
      ctx.emit("change", value);
    }
    return {
      ui,
      options,
      submit
    };
  }
});
</script>

<style lang="less">
.fs-table-columns-fixed-controller {
  .fs-button {
    padding: 2px !important;
    font-size: 10px;
    min-height: auto;
  }
}
</style>
