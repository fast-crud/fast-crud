<template>
  <component
    :is="ui.col.name"
    v-if="computedItem && computedItem.show !== false"
    class="fs-col"
    v-bind="merge(col, computedItem?.col)"
  >
    <fs-form-item
      v-if="computedItem && computedItem?.blank !== true"
      ref="formItemRef"
      :item="computedItem"
      :form-slot="slots"
      :get-context-fn="getContextFn"
      :helper="helper"
      v-bind="attrs"
    />
  </component>
</template>
<script lang="ts" setup>
import { useAttrs, defineProps, PropType, ref } from "vue";
import { useCompute } from "../../use/use-compute";
import { merge } from "lodash-es";
import { useUi } from "@fast-crud/ui-interface";
const { ui } = useUi();
const props = defineProps({
  /**
   * 字段配置
   */
  item: {
    type: Object as PropType<any>,
    default: undefined
  },
  /**
   * 字段组件插槽
   */
  slots: {
    type: Function,
    default: undefined
  },
  getContextFn: {
    type: Function,
    default: undefined
  },
  col: {
    type: Object,
    default: () => {
      return {};
    }
  },
  helper: {
    type: [String, Object],
    default: undefined
  }
});
const { doComputed } = useCompute();
const computedItem = doComputed(
  () => {
    return props.item;
  },
  () => {
    return props.getContextFn();
  }
);

const attrs = useAttrs();
const formItemRef = ref();
function getFormItemRef() {
  return formItemRef.value;
}

defineExpose({
  getFormItemRef
});
</script>

<style lang="less">
.fs-form-item-col {
}
</style>
