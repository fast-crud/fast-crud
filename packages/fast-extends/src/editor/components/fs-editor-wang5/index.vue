<template>
  <div class="fs-editor-wang5" v-bind="container">
    <Toolbar
      :ref="toolbarRef"
      style="border-bottom: 1px solid #ccc"
      :editor="editorRef"
      :default-config="toolbarConfigRef"
      :mode="mode"
      v-bind="toolbarAttrs"
    />
    <Editor
      style="height: 500px; overflow-y: hidden"
      :default-config="editorConfigRef"
      :mode="mode"
      v-bind="$attrs"
      @on-change="onChange"
      @on-created="handleCreated"
    />
  </div>
</template>

<script lang="ts">
import "@wangeditor/editor/dist/css/style.css"; // 引入 css

import { onBeforeUnmount, defineComponent, ref, shallowRef, onMounted, watch, computed, Ref } from "vue";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";

import { defaultConfig } from "../../type/config.js";
import { merge } from "lodash-es";
import { FsUploaderDoUploadOptions } from "../../../uploader/d/type";
import { useUi, utils } from "@fast-crud/fast-crud";
import { useUploader } from "../../../uploader";
import { DomEditor } from "@wangeditor/editor";
type InsertFnType = (url: string, alt?: string, href?: string) => void;
/**
 * wangEditor5组件封装
 * 文档：https://www.wangeditor.com/v5/for-frame.html#使用-1
 */
export default defineComponent({
  name: "FsEditorWang5",
  components: { Editor, Toolbar },
  inheritAttrs: false,
  props: {
    /**
     * 容器配置
     * 包装editor和toolbar的外部容器配置，可以设置class，style等
     */
    container: {
      type: Object
    },
    /**
     * editor的模式
     */
    mode: {
      type: String
    },
    /**
     * 工具条配置
     */
    toolbarConfig: {
      type: Object
    },
    /**
     * 工具条style等配置
     */
    toolbarAttrs: {
      type: Object
    },
    /**
     * 编辑器默认配置
     */
    editorConfig: {
      type: Object
    },
    /**
     * uploader参数
     * 配置则开启上传
     */
    uploader: {
      type: Object
    },
    /**
     * 只读
     */
    readonly: {
      type: Boolean
    },
    /**
     * 是否禁用
     */
    disabled: {
      type: Boolean
    }
  },
  emits: ["ready"],
  setup(props: any, ctx: any) {
    // 编辑器实例，必须用 shallowRef
    const editorRef = shallowRef();
    const toolbarRef: Ref = ref();
    const uploaderImplRef: Ref = ref();
    const valueHtml: Ref = ref("");

    function toggleEnabled(value: boolean) {
      if (!editorRef.value) {
        return;
      }
      if (value) {
        editorRef.value.enable();
      } else {
        editorRef.value.disable();
      }
    }

    watch(
      () => {
        return props.readonly;
      },
      (value) => {
        toggleEnabled(!value);
      },
      {
        immediate: true
      }
    );

    watch(
      () => {
        return props.disabled;
      },
      (value) => {
        toggleEnabled(!value);
      },
      {
        immediate: true
      }
    );

    const toolbarConfigRef = computed(() => {
      return merge({}, defaultConfig.wangEditor5.toolbarConfig, props.toolbarConfig);
    });

    const MENU_CONF: any = {};
    if (props.uploader) {
      async function doUpload(option: FsUploaderDoUploadOptions) {
        option.options = props.uploader;

        const { getUploaderImpl } = useUploader();
        let uploaderRef = await getUploaderImpl(option.options.type);
        if (uploaderRef == null) {
          ui.message.warn("Sorry，The uploader component is not ready yet");
          throw new Error("Sorry，The component is not ready yet");
        }

        return await uploaderRef?.upload(option);
      }

      async function customUpload(file: File, insertFn: InsertFnType) {
        // TS 语法
        // async customUpload(file, insertFn) {                   // JS 语法
        // file 即选中的文件
        // 自己实现上传，并得到图片 url alt href
        // 最后插入图片

        const item: any = {
          status: "uploading",
          progress: 0,
          message: undefined
        };

        const onProgress = (e: any) => {
          item.progress = e.percent;
        };
        const onError = (e: any) => {
          item.status = "error";
          item.message = "文件上传出错:" + e.message;
          console.error(item.message, e);
        };
        const option = {
          file: file,
          fileName: file.name,
          onProgress,
          onError
        };

        const res = await doUpload(option);
        let url = res?.url;
        if (props.uploader?.buildUrl) {
          url = await props.uploader.buildUrl(res);
        }
        // 上传图片，返回结果，将图片插入到编辑器中
        insertFn(url);
      }

      MENU_CONF.uploadImage = {
        customUpload
      };
      MENU_CONF.uploadVideo = {
        customUpload
      };
    }

    const editorConfigRef = computed(() => {
      return merge(
        {
          placeholder: "请输入内容...",
          MENU_CONF
        },
        defaultConfig.wangEditor5.editorConfig,
        props.editorConfig
      );
    });

    // 组件销毁时，也及时销毁编辑器
    onBeforeUnmount(() => {
      const editor = editorRef.value;
      if (editor == null) return;
      editor.destroy();
    });

    const handleCreated = (editor: any) => {
      editorRef.value = editor; // 记录 editor 实例，重要！
      toggleEnabled(!props.readonly && !props.disabled);
      ctx.emit("ready");
    };

    function getEditorRef() {
      return editorRef;
    }
    function getToolRef() {
      return toolbarRef;
    }
    const { ui } = useUi();
    let formItemContext = ui.formItem.injectFormItemContext();
    function onChange() {
      formItemContext.onChange();
    }

    onMounted(() => {});

    return {
      uploaderImplRef,
      getToolRef,
      getEditorRef,
      toolbarRef,
      editorRef,
      valueHtml,
      toolbarConfigRef,
      editorConfigRef,
      handleCreated,
      onChange
    };
  }
});
</script>
<style lang="less">
.fs-editor-wang5 {
  border: 1px solid #eee;
  &.w-e-full-screen-container {
    z-index: 10000;
  }
}
</style>
