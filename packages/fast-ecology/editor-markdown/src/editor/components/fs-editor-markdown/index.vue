<template>
  <MavonEditorComponent class="fs-editor-markdown" ref="editorRef" v-bind="editorProps" />
</template>

<script lang="ts" setup>
import mavonEditor from "mavon-editor";
import { computed, ref, useAttrs } from "vue";

defineOptions({
  name: "FsEditorMarkdown",
  inheritAttrs: false 
});

const props = defineProps<{
  modelValue?: string;
  disabled?: boolean;
  readonly?: boolean;
}>();

const emits = defineEmits(["update:modelValue", "change", "imgAdd"]);
const attrs = useAttrs();
const MavonEditorComponent = mavonEditor.mavonEditor;
const editorRef = ref<any>();

const editorProps = computed(() => ({
  ...attrs,
  class: ["fs-editor-markdown", attrs.class],
  modelValue: props.modelValue ?? "",
  ...(props.disabled || props.readonly ? { editable: false } : {}),
  "onUpdate:modelValue": updateValue,
  onImgAdd(position: number, file: File) {
    emits("imgAdd", position, file, editorRef.value);
  },
  onChange(value: string, render: string) {
    updateValue(value);
    emits("change", value, render);
  }
}));

function updateValue(value: string) {
  emits("update:modelValue", value);
}
</script>

<style lang="less">
.fs-editor-markdown {
  width: 100%;
}
</style>
