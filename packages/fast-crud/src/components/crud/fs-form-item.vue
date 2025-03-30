<template>
  <component
    :is="ui.formItem.name"
    v-if="item"
    class="fs-form-item"
    :[ui.formItem.prop]="computedKey"
    v-bind="item"
    :path="item.key"
    :rule-path="item.key"
    title=""
  >
    <template #label>
      <span v-if="computedLabelIsRender" class="fs-form-item-label-text">
        <fs-render :render-func="computedLabelRender"></fs-render>
      </span>
      <span v-else class="fs-form-item-label-text" :title="computedLabel">
        {{ computedLabel }}
      </span>

      <component
        :is="ui.tooltip.name"
        v-if="item.helper && computedHelperPosition === 'label'"
        v-bind="computedHelperTooltip"
      >
        <template #[ui.tooltip.content]>
          <span class="fs-form-helper-tooltip">
            <fs-form-helper :helper="item.helper" :scope="scopeFunc()" />
          </span>
        </template>
        <template #[ui.tooltip.trigger]>
          <span class="fs-form-item-label-icon">
            <fs-icon class="fs-form-item-label-icon-inner" :icon="ui.icons.question"></fs-icon>
          </span>
        </template>
      </component>
    </template>
    <div class="fs-form-item-content">
      <fs-render v-if="item.topRender" :render-func="item.topRender" :scope="scopeFunc()" />
      <div class="fs-form-item-render">
        <fs-render v-if="item.prefixRender" :render-func="item.prefixRender" :scope="scopeFunc()" />
        <div class="fs-form-item-component">
          <fs-slot-render v-if="formSlot" :slots="formSlot" :scope="scopeFunc()" />
          <template v-else-if="item.component?.show !== false">
            <fs-render
              v-if="item.conditionalRender && item.conditionalRender.match && item.conditionalRender.match(scopeFunc())"
              :render-func="item.conditionalRender.render"
              :scope="scopeFunc()"
            />
            <fs-render v-else-if="item.render" :render-func="item.render" :scope="scopeFunc()" />
            <fs-component-render
              v-else
              ref="componentRenderRef"
              v-bind="item.component"
              :model-value="modelValue"
              :scope="scopeFunc()"
              @update:model-value="updateModelValue"
            />
          </template>
        </div>
        <fs-render v-if="item.suffixRender" :render-func="item.suffixRender" :scope="scopeFunc()" />
      </div>
      <fs-render v-if="item.bottomRender" :render-func="item.bottomRender" :scope="scopeFunc()" />
      <template v-if="item.helper && computedHelperPosition !== 'label'">
        <fs-form-helper :helper="item.helper" :scope="scopeFunc()" />
      </template>
    </div>
  </component>
</template>
<script lang="ts">
import { ref, computed, defineComponent, Ref, PropType } from "vue";
import FsRender from "../render/fs-render.js";
import { ScopeContext } from "../../d";
import { useMerge, useUi } from "../../use";
import utils from "../../utils";
/**
 * form-item组件封装
 */
export default defineComponent({
  name: "FsFormItem",
  components: { FsRender },
  props: {
    /**
     * 表单字段值(v-model)
     */
    modelValue: {},
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
    const { ui } = useUi();
    const { merge } = useMerge();
    const componentRenderRef = ref();

    utils.trace("fs-form-item");
    // const scopeComputed: Ref<ScopeContext> = computed(() => {});

    const scopeFunc = () => {
      const scope = props.getContextFn ? props.getContextFn() : {};
      return { value: props.modelValue, key: props.item.key, ...scope };
    };

    function updateModelValue(value: any) {
      ctx.emit("update:modelValue", value);
    }
    function getComponentRef(isAsync = false) {
      if (isAsync) {
        return componentRenderRef.value?.getTargetRefAsync();
      }
      return componentRenderRef.value?.getTargetRef();
    }

    const computedHelperPosition = computed(() => {
      return props.item?.helper?.position || (props.helper as any)?.position;
    });
    const computedHelperTooltip = computed(() => {
      return merge({}, props.item.helper?.tooltip, (props.helper as any)?.tooltip);
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

    const computedLabel = computed(() => {
      return props.item.label || props.item.title;
    });
    const computedLabelIsRender = computed(() => {
      return computedLabel.value instanceof Function;
    });

    const computedLabelRender = () => {
      return computedLabel.value(scopeFunc());
    };

    return {
      ui,
      updateModelValue,
      scopeFunc,
      getComponentRef,
      componentRenderRef,
      computedHelperPosition,
      computedHelperTooltip,
      computedKey,
      computedLabelIsRender,
      computedLabel,
      computedLabelRender
    };
  }
});
</script>

<style lang="less">
.fs-form-item {
  .ant-form-item-label {
    //line-height: 1;
    .fs-form-item-label-text {
      width: 100%;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
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
        max-width: 100%;
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
