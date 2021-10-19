<template>
  <div class="fs-json-editor">
    <div ref="editorRef" class="jsoneditor-vue"></div>
    <div v-if="showBtns !== false" class="jsoneditor-btns">
      <button class="json-save-btn" :type="button" :disabled="state.error" @click="onSave">
        {{ state.locale[lang].save }}
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { ComponentPublicInstance, defineComponent, ref, getCurrentInstance, onMounted, reactive, watch } from "vue";
import "./style.css";
import JSONEditor from "jsoneditor";
import "jsoneditor/dist/jsoneditor.css";
export default {
  name: "FsJsonEditor",
  props: {
    modelValue: [String, Boolean, Object, Array],
    showBtns: [Boolean],
    expandedOnStart: {
      type: Boolean,
      default: false
    },
    mode: {
      type: String,
      default: "tree"
    },
    modes: {
      type: Array,
      default: function () {
        return ["tree", "code", "form", "text", "view"];
      }
    },
    lang: {
      type: String,
      default: "en"
    }
  },
  emits: ["error", "update:modelValue", "save", "change"],
  setup(props: any, { emit }) {
    const root = getCurrentInstance()?.root.proxy as ComponentPublicInstance;

    const editorRef = ref();
    const state = reactive({
      editor: null as any,
      error: false,
      json: {},
      internalChange: false,
      expandedModes: ["tree", "view", "form"],
      locale: {
        it: {
          save: "SALVA"
        },
        en: {
          save: "SAVE"
        },
        zh: {
          save: "保存"
        }
      }
    });
    watch(
      () => props.modelValue as unknown as any,
      async (val) => {
        if (!state.internalChange) {
          state.json = val;
          await setEditor(val);
          state.error = false;
          expandAll();
        }
      },
      { immediate: true }
    );

    onMounted(() => {
      const options = {
        mode: props.mode,
        modes: props.modes,
        onChange() {
          try {
            const json = state.editor.get();
            state.json = json;
            state.error = false;
            emit("change", json);
            state.internalChange = true;
            emit("update:modelValue", json);
            root.$nextTick(function () {
              state.internalChange = false;
            });
          } catch (e) {
            state.error = true;
            emit("error", e);
          }
        },
        onModeChange() {
          expandAll();
        }
      };
      state.editor = new JSONEditor(editorRef.value, options, state.json);
    });

    function expandAll() {
      console.log(state.editor.getMode());
      if (props.expandedOnStart && state.expandedModes.includes(state.editor.getMode())) {
        (state.editor as any).expandAll();
      }
    }

    function onSave() {
      emit("save", state.json);
    }

    function setEditor(value: any): void {
      if (state.editor) state.editor.set(value);
    }

    return {
      setEditor,
      state,
      onSave,
      expandAll,
      editorRef
    };
  }
};
</script>
<style lang="less"></style>
