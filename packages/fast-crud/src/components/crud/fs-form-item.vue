<template>
  <component
    :is="$fsui.formItem.name"
    class="fs-form-item"
    :[$fsui.formItem.label]="item.title"
    :[$fsui.formItem.prop]="item.key"
    v-bind="item"
  >
    <fs-slot-render v-if="slots" :slots="slots" :scope="buildItemScope(item)" />
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
    <template v-if="item.helper">
      <div class="fs-form-helper">
        <template v-if="typeof item.helper === 'string'">{{ item.helper }}</template>
        <template v-else-if="item.helper.render">
          <fs-render :render-func="item.helper.render" :scope="buildItemScope(item)" />
        </template>
      </div>
    </template>
  </component>
</template>
<script>
import traceUtil from "../../utils/util.trace";
import FsRender from "../render/fs-render";
import { ref } from "vue";

/**
 * form-item组件封装
 */
export default {
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
      type: Object,
      default: undefined
    },
    /**
     * 插槽
     */
    slots: {
      type: Object,
      default: undefined
    },
    /**
     * 获取上下文方法
     */
    getContextFn: {
      type: Function,
      default: undefined
    }
  },
  emits: ["update:modelValue"],
  setup(props, ctx) {
    traceUtil.trace("fs-from-item");
    const componentRenderRef = ref();
    function buildItemScope(item) {
      const scope = props.getContextFn();
      console.log("build scope", scope, item);
      const newScope = { value: props.modelValue, key: item.key, ...scope };
      console.log("new scope", newScope);
      return newScope;
    }

    function updateModelValue(value) {
      ctx.emit("update:modelValue", value);
    }
    function getComponentRef() {
      return componentRenderRef.value?.getTargetRef();
    }
    return {
      updateModelValue,
      buildItemScope,
      getComponentRef,
      componentRenderRef
    };
  }
};
</script>

<style lang="less"></style>
