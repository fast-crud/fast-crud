<template>
  <div ref="monacoRef" class="fs-editor-code"></div>
</template>

<script lang="ts" setup>
import * as monaco from "monaco-editor";
// import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import { onMounted, onUnmounted, ref, watch } from "vue";
import { cloneDeep, debounce as lodashDebounce } from "lodash-es";
import {
  importJavascriptContribution,
  importJsonContribution,
  importMonacoYaml,
  importYamlContribution
} from "./async-import";
import { initWorkers } from "./workers";
/**
 * config:
 *   value: '', // 编辑器初始文本
 *   language: 'javascript', // 语言
 *   theme: 'vs', // 主题
 *   readOnly: false, // 是否只读
 *   minimap: { enabled: false }, // 是否启用小地图
 *   fontSize: 14, // 字体大小
 *   tabSize: 2, // tab缩进长度
 *   automaticLayout: true, // 自动布局
 *   lineNumbers: 'off', // 是否启用行号
 *   contextmenu: true, // 是否启用上下文菜单
 *   folding: true, // 是否启用代码折叠
 *   foldingStrategy: 'auto', // 代码折叠策略
 *   wordWrap: 'on', // 自动换行设置
 *   wrappingIndent: 'indent', // 换行缩进
 *   formatOnPaste: true, // 粘贴时是否自动格式化
 *   formatOnType: true, // 输入时是否自动格式化
 *   dragAndDrop: true, // 是否允许拖放
 *   cursorStyle: 'line', // 光标样式
 *   cursorBlinking: 'blink', // 光标闪烁方式
 *   scrollbar: {
 *     vertical: 'auto', // 垂直滚动条的显示方式
 *     horizontal: 'auto', // 水平滚动条的显示方式
 *     verticalScrollbarSize: 2, // 垂直滚动条的宽
 *     horizontalScrollbarSize: 2, // 水平滚动条的高度
 *   }
 */
const props = defineProps<{
  language?: string;
  modelValue?: string;
  config?: any;
  schema?: any;
  debounce?: number;
  init?: any;
  readonly?: boolean;
  disabled?: boolean;
  id?: string;
}>();

export type EditorCodeCtx = {
  // monaco对象
  monaco: any;
  //语言
  language: string;
  //配置
  config: any;
  //editor实例对象
  instance?: any;

  schema?: any;

  initialValue?: any;
};
initWorkers();
const monacoRef = ref();

let instanceRef: any = null;

function disposeEditor() {
  if (instanceRef) {
    instanceRef.dispose(); //使用完成销毁实例
  }
}

onUnmounted(() => {
  disposeEditor();
});

const emits = defineEmits(["update:modelValue", "change", "ready"]);

const emitValue = lodashDebounce((value: any) => {
  emits("update:modelValue", value);
}, props.debounce || 500);

async function createEditor(ctx: EditorCodeCtx) {
  disposeEditor();
  const instance = monaco.editor.create(monacoRef.value, {
    automaticLayout: true,
    value: props.modelValue,
    language: ctx.language,
    theme: "vs-dark",
    minimap: { enabled: false },
    readOnly: props.readonly || props.disabled,
    hover: {
      enabled: true
    },
    ...ctx.config
  });

  // @event `change`
  instance.onDidChangeModelContent((event) => {
    const value = instance.getValue();
    if (props.modelValue !== value) {
      emits("change", value);
      emitValue(value);
    }
  });

  instanceRef = instance;
  ctx.instance = instance;
  emits("ready", ctx);
  return instance;
}

async function initJavascript(ctx: EditorCodeCtx) {
  await importJavascriptContribution();
  monaco.languages.register({ id: "javascript" });
}

async function initJson(ctx: EditorCodeCtx) {
  await importJsonContribution();
  monaco.languages.register({ id: "json" });

  const schemas = [];
  if (ctx.schema) {
    schemas.push({
      uri: "http://myserver/foo-schema.json", // id of the first schema
      fileMatch: ["*"], // associate with our model
      schema: {
        ...ctx.schema
      }
    });
  }

  monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
    validate: true,
    enableSchemaRequest: false,
    schemas
  });
}

async function initYaml(ctx: EditorCodeCtx) {
  await importYamlContribution();
  const { configureMonacoYaml } = await importMonacoYaml();
  monaco.languages.register({ id: "yaml" });
  let id = `fs-editor-code-yaml-${props.id || ""}.yaml`;
  const schemas = [];
  if (ctx.schema) {
    schemas.push({
      fileMatch: ["*"], // associate with our model
      schema: {
        ...ctx.schema
      },
      uri: `http://myserver/${id}`
    });
  }
  configureMonacoYaml(monaco, {
    schemas,
    format: true,
    hover: true,
    completion: true,
    validate: true,
    isKubernetes: false,
    enableSchemaRequest: false
  });

  // const uri = monaco.Uri.parse(id);
  // const oldModel = monaco.editor.getModel(uri);
  // if (oldModel) {
  //   oldModel.dispose();
  // }
  // ctx.config.model = monaco.editor.createModel(props.modelValue, null, uri);
}

async function doInit() {
  disposeEditor();
  const ctx: EditorCodeCtx = {
    monaco,
    language: props.language || "javascript",
    config: cloneDeep(props.config || {}),
    initialValue: props.modelValue || "",
    schema: props.schema
  };
  if (ctx.language === "javascript") {
    await initJavascript(ctx);
  } else if (ctx.language === "yaml") {
    await initYaml(ctx);
  } else if (ctx.language === "json") {
    await initJson(ctx);
  }

  await createEditor(ctx);
}

onMounted(async () => {
  await doInit();
  watch(
    () => {
      return {
        language: props.language,
        config: props.config
      };
    },
    (value: any) => {
      doInit();
    }
  );
});

watch(
  () => {
    return props.modelValue;
  },
  (value: any) => {
    if (instanceRef && instanceRef.getValue() !== value) {
      instanceRef.setValue(value);
    }
  }
);
</script>

<style lang="less">
.fs-editor-code {
  min-height: 100px;
  width: 100%;
  border: 1px solid #eee;
  border-radius: 5px;
}

.monaco-editor .hover-content {
  z-index: 10000 !important;
}
</style>
