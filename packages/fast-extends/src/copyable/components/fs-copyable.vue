<template>
  <div class="fs-copyable" :class="{ 'show-on-hover': copyButton.showOnHover }">
    <span v-clipboard="modelValue" v-clipboard:success="onSuccess" v-clipboard:error="onError" class="pointer">{{
      modelValue
    }}</span>
    <slot></slot>
    <component
      :is="tagName"
      v-clipboard="modelValue"
      v-clipboard:success="onSuccess"
      v-clipboard:error="onError"
      class="pointer copy-button"
      v-bind="copyButton"
    >
      {{ copyButton.text ?? "复制" }}
    </component>
  </div>
</template>

<script lang="ts">
import { computed, ref } from "vue";
import { VueClipboard } from "@soerenmartius/vue3-clipboard";
import { useUi } from "@fast-crud/fast-crud";
import _ from "lodash-es";

/**
 * fs-copyable
 * 可以点击复制文本
 * 通过默认插槽可以自定义文本主体
 */
export default {
  name: "FsCopyable",
  directives: {
    VueClipboard
  },
  props: {
    modelValue: {},
    /**
     * 复制按钮
     * show: 是否显示，默认true
     * text: 按钮文字
     * ...其他tag组件参数
     */
    button: {
      type: Object
    },
    successMessage: {
      type: [Boolean, String],
      default: true
    },
    errorMessage: {
      type: [Boolean, String],
      default: true
    }
  },
  emits: ["update:modelValue", "success", "error"],
  setup(props: any, { emit, slots }) {
    const textInSlot = computed(() => {
      return slots.default != null;
    });
    const { ui } = useUi();
    const tagName = ref(ui.tag.name);

    const copyButton = computed(() => {
      const defaultButton = {
        text: "复制",
        style: { float: "right" },
        color: "green",
        show: true,
        showOnHover: true
      };
      return _.merge({}, defaultButton, props.button);
    });
    function onSuccess() {
      emit("success");
      if (props.successMessage) {
        ui.message.success(props.successMessage === true ? "复制成功" : props.successMessage);
      }
    }
    function onError() {
      emit("error");
      if (props.errorMessage) {
        ui.message.error(props.errorMessage === true ? "复制失败" : props.errorMessage);
      }
    }
    return {
      textInSlot,
      tagName,
      copyButton,
      onSuccess,
      onError
    };
  }
};
</script>
<style lang="less">
.fs-copyable {
  .pointer {
    cursor: pointer;
  }
  &.show-on-hover {
    .copy-button {
      display: none;
    }
    &:hover {
      .copy-button {
        display: block;
      }
    }
  }
}
</style>
