<template>
  <div class="fs-editor-wang">
    <div :id="uniqueId"></div>
    <textarea v-model="currentValue" class="fs-editor-wang-preview" readonly></textarea>
    <fs-uploader ref="uploaderImplRef" :type="uploader?.type" />
  </div>
</template>

<script>
import WangEditor from "wangeditor";
import lodash from "lodash-es";
import wangConfig from "./utils/config";
import defaultConfig from "../../type/config";
export default {
  name: "FsEditorWang",
  props: {
    modelValue: {
      type: String,
      required: false,
      default: ""
    },
    config: {
      type: Object
    },
    /**
     * 同一个页面多个edit时，需要配置不同的id
     */
    id: {
      default: "1"
    },
    /**
     * uploader参数，配置则开启上传
     */
    uploader: {
      type: Object
    },
    disabled: {
      type: Boolean
    }
  },
  emits: ["update:modelValue", "change"],
  data() {
    return {
      editor: null,
      currentValue: "",
      options: {}
    };
  },
  computed: {
    uniqueId() {
      return "fs-wang-editor-" + this.id;
    }
  },
  watch: {
    modelValue: {
      handler(val) {
        // 确认是新的值
        if (val !== this.currentValue) {
          this.currentValue = val;
          // 尝试更新
          if (this.editor) {
            if (this.dispatch) {
              this.dispatch("ElFormItem", "el.form.blur");
            }
            // this.$emit("change", val);
            this.editor.txt.html(value);
          }
        }
      },
      immediate: true
    },
    disabled: {
      handler(value) {
        if (this.editor) {
          if (value === true) {
            this.editor.disable();
          } else {
            this.editor.enable();
          }
        }
      },
      immediate: true
    }
  },
  mounted() {
    this.init();
  },
  beforeUnmount() {
    // 调用销毁 API 对当前编辑器实例进行销毁
    this.editor.destroy();
    this.editor = null;
  },
  methods: {
    init() {
      const editor = new WangEditor("#" + this.uniqueId);
      lodash.merge(editor.config, wangConfig, defaultConfig.wangEditor, this.config);
      editor.config.onchange = (newHtml) => {
        this.$emit("update:modelValue", newHtml);
        this.$emit("change", newHtml);
        this.currentValue = newHtml;
      };

      if (this.uploader) {
        editor.config.customUploadImg = async (resultFiles, insertImgFn) => {
          // resultFiles 是 input 中选中的文件列表
          // insertImgFn 是获取图片 url 后，插入到编辑器的方法
          const file = resultFiles[0];

          const item = {
            status: "uploading",
            progress: 0
          };

          const onProgress = (e) => {
            item.progress = e.percent;
          };
          const onError = (e) => {
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

          const res = await this.doUpload(option);
          let url = res?.url;
          if (this.uploader?.buildUrl) {
            url = await this.uploader.buildUrl(res);
          }
          // 上传图片，返回结果，将图片插入到编辑器中
          insertImgFn(url);
        };
      }

      editor.create();
      editor.txt.html(this.currentValue);
      this.editor = editor;
    },
    async doUpload(option) {
      option.options = this.uploader;
      let uploaderRef = this.$refs.uploaderImplRef.getUploaderRef();
      if (uploaderRef == null) {
        throw new Error("Sorry，The component is not ready yet");
      }
      return await uploaderRef?.upload(option);
    }
  }
};
</script>
<style lang="less">
.fs-editor-wang {
  .fs-editor-wang-preview {
    display: none;
  }

  .w-e-menu .w-e-panel-container .w-e-panel-tab-content input[type="text"] {
    height: auto;
  }
}
</style>
