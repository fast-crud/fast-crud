<template>
  <div class="fs-copyable" :class="{ 'show-on-hover': copyButton.showOnHover, inline: inline }">
    <span v-clipboard="modelValue" v-clipboard:success="onSuccess" v-clipboard:error="onError" class="pointer text">
      <template v-if="$slots.default">
        <slot></slot>
      </template>
      <template v-else>
        {{ modelValue }}
      </template>
    </span>

    <div v-if="modelValue != null && copyButton.show !== false" class="copy-button">
      <component
        :is="tagName"
        v-clipboard="modelValue"
        v-clipboard:success="onSuccess"
        v-clipboard:error="onError"
        class="pointer text"
        v-bind="copyButton"
      >
        {{ copyButton.text ?? "复制" }}
      </component>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref, Ref } from "vue";
import { useUi } from "@fast-crud/fast-crud";
import { merge } from "lodash-es";

interface CopyButton {
  show: boolean;
  size: string;
  showOnHover: boolean;
  text: string;
  [key: string]: any;
}

/**
 * fs-copyable
 * 可以点击复制文本
 * 通过默认插槽可以自定义文本主体
 */
export default defineComponent({
  name: "FsCopyable",
  props: {
    modelValue: {
      type: [String, Number, Boolean],
      default: undefined
    },
    /**
     * 复制按钮
     * show: 是否显示，默认true
     * text: 按钮文字
     * ...其他tag组件参数
     */
    button: {
      type: Object as PropType<CopyButton>,
      default() {
        return {};
      }
    },
    /**
     * 成功信息
     */
    successMessage: {
      type: [Boolean, String],
      default: true
    },
    /**
     * 错误时的信息
     */
    errorMessage: {
      type: [Boolean, String],
      default: true
    },

    inline: {
      type: Boolean,
      default: false
    }
  },
  emits: [
    "update:modelValue",
    /**
     * 成功事件
     */
    "success",
    /**
     * 失败事件
     */
    "error"
  ],
  setup(props: any, { emit, slots }) {
    const textInSlot = computed(() => {
      return slots.default != null;
    });
    const { ui } = useUi();
    const tagName: Ref<string> = ref(ui.tag.name);

    const copyButton = computed(() => {
      const defaultButton = {
        text: "复制",
        size: "small",
        [ui.tag.type]: "success",
        show: true,
        showOnHover: false
      };
      return merge({}, defaultButton, props.button);
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
});
</script>
<style lang="less">
.fs-copyable {
  position: relative;
  display: flex;
  align-items: center;
  &.inline {
    display: inline-flex;
  }
  .pointer {
    cursor: pointer;
  }
  .text {
    white-space: nowrap; /* 确保文本在一行内显示 */
    overflow: hidden; /* 隐藏溢出的内容 */
    text-overflow: ellipsis; /* 使用省略号表示文本溢出 */
    flex: 1;
  }
  .copy-button {
    //position: absolute;
    //right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: 10px;
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
