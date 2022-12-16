<template>
  <component
    :is="$fsui.formItem.name"
    v-if="item"
    class="fs-form-item"
    :[$fsui.formItem.prop]="computedKey"
    v-bind="item"
    :path="item.key"
    :rule-path="item.key"
  >
    <template #label>
      <span>{{ item.label || item.title }}</span>

      <component
        :is="$fsui.tooltip.name"
        v-if="item.helper && computedHelperPosition === 'label'"
        v-bind="computedHelperTooltip"
      >
        <template #[$fsui.tooltip.content]>
          <span class="fs-form-helper-tooltip">
            <fs-form-helper :helper="item.helper" :scope="scopeComputed" />
          </span>
        </template>
        <template #[$fsui.tooltip.trigger]>
          <span class="fs-form-item-label-icon">
            <fs-icon class="fs-form-item-label-icon-inner" :icon="$fsui.icons.question"></fs-icon>
          </span>
        </template>
      </component>
    </template>
    <div class="fs-form-item-content">
      <div class="fs-form-item-render">
        <fs-render v-if="item.prefixRender" :render-func="item.prefixRender" :scope="scopeComputed" />
        <div class="fs-form-item-component">
          <fs-slot-render v-if="formSlot" :slots="formSlot" :scope="scopeComputed" />
          <template v-else-if="item.component?.show !== false">
            <fs-render v-if="item.component?.render" :render-func="item.component.render" :scope="scopeComputed" />
            <fs-component-render
              v-else
              ref="componentRenderRef"
              v-bind="item.component"
              :model-value="modelValue"
              :scope="scopeComputed"
              @update:modelValue="updateModelValue"
            />
          </template>
        </div>
        <fs-render v-if="item.suffixRender" :render-func="item.suffixRender" :scope="scopeComputed" />
      </div>
      <template v-if="item.helper && computedHelperPosition !== 'label'">
        <fs-form-helper :helper="item.helper" :scope="scopeComputed" />
      </template>
    </div>
  </component>
</template>
<script>
import { ref, computed } from "vue";
import _ from "lodash-es";
/**
 * form-item组件封装
 */
export default {
  name: "FsFormItem",
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
    getContextFn: {
      type: Function,
      default: undefined
    },
    helper: {
      type: [String, Object]
    }
  },
  emits: ["update:modelValue"],
  setup(props, ctx) {
    const componentRenderRef = ref();
    const scopeComputed = computed(() => {
      const scope = props.getContextFn ? props.getContextFn() : {};
      return { value: props.modelValue, key: props.item.key, ...scope };
    });

    function updateModelValue(value) {
      ctx.emit("update:modelValue", value);
    }
    function getComponentRef(isAsync = false) {
      if (isAsync) {
        return componentRenderRef.value?.getTargetRefAsync();
      }
      return componentRenderRef.value?.getTargetRef();
    }

    const computedHelperPosition = computed(() => {
      return props.item?.helper?.position || props.helper?.position;
    });
    const computedHelperTooltip = computed(() => {
      return _.merge({}, props.item.helper?.tooltip, props.helper?.tooltip);
    });
    const computedKey = computed(() => {
      if (props.item == null) {
        return;
      }
      if (props.item.key.indexOf(".") >= 0) {
        return props.item.key.split(".");
      }
      return props.item.key;
    });
    return {
      updateModelValue,
      scopeComputed,
      getComponentRef,
      componentRenderRef,
      computedHelperPosition,
      computedHelperTooltip,
      computedKey
    };
  }
};
</script>

<style lang="less">
.fs-form-item {
  .ant-form-item-label {
    line-height: 1;
  }
  .el-form-item {
    .fs-form-item-label-icon {
      line-height: 1;
      height: inherit;
    }
  }
  .fs-form-item-label-icon {
    margin: 0 2px;
    .fs-form-item-label-icon-inner {
      line-height: inherit;
      height: inherit;
    }
  }
  .fs-form-item-content {
    display: flex;
    flex-direction: column;
    width: 100%;
    flex: 1;
    .fs-form-item-render {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      .fs-form-item-component {
        flex: 1;
      }
    }
  }
}
.fs-form-helper-tooltip {
  .fs-form-helper {
    color: inherit;
  }
}
</style>
