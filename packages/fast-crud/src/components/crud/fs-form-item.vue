<template>
  <component :is="$fsui.formItem.name" class="fs-form-item" :[$fsui.formItem.prop]="item.key" v-bind="item">
    <template #label>
      {{ item.label || item.title }}

      <component
        :is="$fsui.tooltip.name"
        v-if="item.helper && computedHelperPosition === 'label'"
        v-bind="computedHelperTooltip"
      >
        <template #[$fsui.tooltip.content]>
          <fs-form-helper :helper="item.helper" :scope="buildItemScope(item)" />
        </template>
        <fs-icon class="fs-form-item-label-icon" :icon="$fsui.icons.question"></fs-icon>
      </component>
    </template>
    <fs-slot-render v-if="formSlot" :slots="formSlot" :scope="buildItemScope(item)" />
    <template v-else-if="item.component?.show !== false">
      <fs-render v-if="item.component?.render" :render-func="item.component.render" :scope="buildItemScope(item)" />
      <fs-component-render
        v-else
        ref="componentRenderRef"
        v-bind="item.component"
        :model-value="modelValue"
        :scope="buildItemScope(item)"
        @update:modelValue="updateModelValue"
      />
    </template>
    <template v-if="item.helper && computedHelperPosition !== 'label'">
      <fs-form-helper :helper="item.helper" :scope="buildItemScope(item)" />
    </template>
  </component>
</template>
<script>
import FsRender from "../render/fs-render";
import { ref, computed } from "vue";
import FsFormHelper from "./fs-form-helper.vue";
import _ from "lodash-es";
/**
 * form-item组件封装
 */
export default {
  name: "FsFormItem",
  components: { FsFormHelper, FsRender },
  props: {
    /**
     * 表单字段值(v-model)
     */
    modelValue: {},
    /**
     * 字段配置
     */
    item: {
      type: Object,
      default: undefined
    },
    /**
     * 字段组件插槽
     */
    formSlot: {
      type: Function,
      default: undefined
    },
    /**
     * 获取上下文方法
     */
    getContextFn: {
      type: Function,
      default: undefined
    },
    /**
     * helper配置
     */
    helper: {
      type: Object
    }
  },
  emits: ["update:modelValue"],
  setup(props, ctx) {
    const componentRenderRef = ref();
    function buildItemScope(item) {
      const scope = props.getContextFn();
      return { value: props.modelValue, key: item.key, ...scope };
    }

    function updateModelValue(value) {
      ctx.emit("update:modelValue", value);
    }
    function getComponentRef() {
      return componentRenderRef.value?.getTargetRef();
    }

    const computedHelperPosition = computed(() => {
      return props.item?.helper?.position || props.helper?.position;
    });
    const computedHelperTooltip = computed(() => {
      return _.merge({}, props.item.helper?.tooltip, props.helper?.tooltip);
    });
    return {
      updateModelValue,
      buildItemScope,
      getComponentRef,
      componentRenderRef,
      computedHelperPosition,
      computedHelperTooltip
    };
  }
};
</script>

<style lang="less">
.fs-form-item {
  .fs-form-item-label-icon {
    margin: 0 2px;
  }
}
</style>
