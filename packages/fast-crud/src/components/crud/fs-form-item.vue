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
      <fs-render
        v-if="item.component?.render"
        :render-func="item.component.render"
        :scope="buildItemScope(item)"
      />
      <fs-component-render
        v-else
        ref="componentRenderRef"
        v-bind="item.component"
        :modelValue="modelValue"
        @update:modelValue="updateModelValue"
        :scope="buildItemScope(item)"
      />
    </template>
    <template v-if="item.helper">
      <div class="fs-form-helper">
        <template v-if="typeof item.helper === 'string'">{{
          item.helper
        }}</template>
        <template v-else-if="item.helper.render">
          <fs-render
            :renderFunc="item.helper.render"
            :scope="buildItemScope(item)"
          />
        </template>
      </div>
    </template>
  </component>
</template>
<script>
import traceUtil from "../../utils/util.trace";
import FsRender from "../render/fs-render";
export default {
  name: "FsFormItem",
  components: { FsRender },
  props: {
    modelValue: {},
    item: {},
    slots: {},
    getContextFn: {},
  },
  emits: ["update:modelValue"],
  setup(props, ctx) {
    traceUtil.trace("fs-from-item");

    function buildItemScope(item) {
      const scope = props.getContextFn();
      return { value: props.modelValue, key: item.key, ...scope };
    }

    function updateModelValue(value) {
      ctx.emit("update:modelValue", value);
    }
    return {
      updateModelValue,
      buildItemScope,
    };
  },
};
</script>

<style lang="less"></style>
