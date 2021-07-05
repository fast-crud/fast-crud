<template>
  <div
    ref="editor"
    class="ql-editor fs-editor-quill"
    :class="{ 'is-disabled': 'disabled' }"
    style="width: 100%; min-height: 300px"
  ></div>
</template>

<script>
import Quill from "quill";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import _ from "lodash-es";
const fontSizeStyle = Quill.import("attributors/style/size");
fontSizeStyle.whitelist = ["10px", "14px", "16px", "18px", "22px", "26px", "30px", "34px", "38px", "45px"];
Quill.register(fontSizeStyle, true);

// quill编辑器的字体
const fonts = ["SimSun", "SimHei", "Microsoft-YaHei", "KaiTi", "FangSong", "Arial", "Times-New-Roman", "sans-serif"];
const Font = Quill.import("formats/font");
Font.whitelist = fonts; // 将字体加入到白名单
Quill.register(Font, true);

// quill富文本编辑器
export default {
  name: "FsEditorQuill",
  props: {
    value: {
      type: String,
      required: false,
      default: ""
    },
    config: {
      type: Object
    },
    // 上传参数，会临时覆盖全局上传配置参数[d2p-uploader](/guide/extends/uploader.html)
    uploader: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      Quill: undefined,
      currentValue: "",
      options: {
        theme: "snow",
        bounds: document.body,
        debug: "warn",
        modules: {
          toolbar: [
            ["bold", "italic", "underline", "strike"],
            ["blockquote", "code-block"],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ script: "sub" }, { script: "super" }],
            [{ indent: "-1" }, { indent: "+1" }],
            [{ direction: "rtl" }],
            [{ size: fontSizeStyle.whitelist }], // 解决字体大小 normal太小的问题
            // [{ size: ['small', false, 'large', 'huge'] }],
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            [{ color: [] }, { background: [] }],
            [{ font: ["Microsoft-YaHei", "SimSun", "SimHei", "KaiTi", "Arial", "Times-New-Roman"] }],
            [{ align: [] }],
            ["clean"],
            ["link", "image", "video"]
          ]
        },
        placeholder: "书写你的内容",
        readOnly: false
      }
    };
  },
  watch: {
    disabled: {
      handler(value) {
        if (this.Quill) {
          this.Quill.enable(!value);
        }
      },
      immediate: true
    },
    value: {
      handler(val) {
        // 确认是新的值
        if (val !== this.currentValue) {
          this.currentValue = val;
          // 尝试更新
          if (this.Quill) {
            if (this.dispatch) {
              this.dispatch("ElFormItem", "el.form.blur");
            }
            this.$emit("change", val);
            this.Quill.pasteHTML(this.value);
          }
        }
      },
      immediate: true
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      const editor = this.$refs.editor;
      // 初始化编辑器
      _.merge(this.options, this.config);
      this.Quill = new Quill(editor, this.options);

      const toolbar = this.Quill.getModule("toolbar");
      toolbar.addHandler("image", () => {
        this.handlerImage();
      });

      // 默认值
      this.Quill.enable(false);
      this.Quill.pasteHTML(this.currentValue);
      if (!this.disabled) {
        this.$nextTick(() => {
          this.Quill.enable(true);
        });
      }

      // 绑定事件
      this.Quill.on("text-change", (delta, oldDelta, source) => {
        const html = this.$refs.editor.children[0].innerHTML;
        // const text = this.Quill.getText()
        // const quill = this.Quill
        // 更新内部的值
        this.currentValue = html;
        // 发出事件 v-model
        this.$emit("input", html);
        // 发出事件 change
        this.$emit("change", html);
      });
      // 将一些 quill 自带的事件传递出去
      this.Quill.on("text-change", (delta, oldDelta, source) => {
        // 文本变更事件
        this.$emit("text-change", delta, oldDelta, source);
      });
      this.Quill.on("selection-change", (range, oldRange, source) => {
        // 选择框变更事件
        this.$emit("selection-change", range, oldRange, source);
      });
      this.Quill.on("editor-change", (eventName, ...args) => {
        // editor-change事件
        this.$emit("editor-change", eventName, ...args);
      });
      this.$nextTick(() => {
        // 编辑器ready事件
        this.$emit("ready", { vm: this, quill: this.Quill });
      });
    },
    handlerImage() {
      const quill = this.Quill;
      var Imageinput = document.createElement("input");
      Imageinput.setAttribute("type", "file");
      Imageinput.setAttribute("name", "upload_file");
      Imageinput.setAttribute("accept", "image/png, image/gif, image/jpeg");
      Imageinput.classList.add("ql-image");
      Imageinput.addEventListener("change", () => {
        var file = Imageinput.files[0];

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
          log.debug(e);
        };
        const option = {
          file: file,
          fileName: file.name,
          onProgress,
          onError
        };

        this.doUpload(option).then((upload) => {
          const url = (item.url = upload.url);
          item.status = "done";
          const range = quill.getSelection(true);
          // let index = range.index + range.length
          quill.insertEmbed(range.index, "image", url);
        });
      });
      Imageinput.click();
    },
    doUpload(option) {
      option.config = this.uploader;
      return this.getUploader().then((uploader) => {
        return uploader.upload(option);
      });
    },
    getUploader() {
      let type = this.type;
      if (this.uploader != null && this.uploader.type != null) {
        type = this.uploader.type;
      }
      return D2pUploader.getUploader(type);
    },
    beforeUpload(file) {
      return this.getUploader().beforeUpload(file);
    }
  }
};
</script>
<style lang="less">
.ql-toolbar {
  line-height: 24px;
}
.ql-disabled {
  cursor: not-allowed;
  .ql-editor {
    cursor: not-allowed;
  }
}
/**设置默认字体显示
  **/
.ql-container {
  font-size: 16px;
}

.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="10px"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="10px"]::before {
  content: "10px";
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="12px"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="12px"]::before {
  content: "12px";
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="14px"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="14px"]::before {
  content: "14px";
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="16px"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="16px"]::before {
  content: "16px";
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="18px"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="18px"]::before {
  content: "18px";
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="20px"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="20px"]::before {
  content: "20px";
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="22px"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="22px"]::before {
  content: "22px";
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="24px"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="24px"]::before {
  content: "24px";
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="26px"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="26px"]::before {
  content: "26px";
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="28px"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="28px"]::before {
  content: "28px";
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="30px"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="30px"]::before {
  content: "30px";
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="32px"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="32px"]::before {
  content: "32px";
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="34px"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="34px"]::before {
  content: "34px";
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="36px"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="36px"]::before {
  content: "36px";
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="38px"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="38px"]::before {
  content: "38px";
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="40px"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="40px"]::before {
  content: "40px";
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="45px"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="45px"]::before {
  content: "45px";
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="50px"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="50px"]::before {
  content: "50px";
}

/*字体*/
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value="SimSun"]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value="SimSun"]::before {
  content: "宋体";
  font-family: "SimSun";
}
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value="SimHei"]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value="SimHei"]::before {
  content: "黑体";
  font-family: "SimHei";
}
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value="Microsoft-YaHei"]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value="Microsoft-YaHei"]::before {
  content: "微软雅黑";
  font-family: "Microsoft YaHei";
}
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value="KaiTi"]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value="KaiTi"]::before {
  content: "楷体";
  font-family: "KaiTi";
}
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value="FangSong"]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value="FangSong"]::before {
  content: "仿宋";
  font-family: "FangSong";
}
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value="Arial"]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value="Arial"]::before {
  content: "Arial";
  font-family: "Arial";
}
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value="Times-New-Roman"]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value="Times-New-Roman"]::before {
  content: "T New Roman";
  font-family: "Times New Roman";
}
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value="sans-serif"]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value="sans-serif"]::before {
  content: "sans-serif";
  font-family: "sans-serif";
}

.ql-font-SimSun {
  font-family: "SimSun";
}
.ql-font-SimHei {
  font-family: "SimHei";
}
.ql-font-Microsoft-YaHei {
  font-family: "Microsoft YaHei";
}
.ql-font-KaiTi {
  font-family: "KaiTi";
}
.ql-font-FangSong {
  font-family: "FangSong";
}
.ql-font-Arial {
  font-family: "Arial";
}
.ql-font-Times-New-Roman {
  font-family: "Times New Roman";
}
.ql-font-sans-serif {
  font-family: "sans-serif";
}
</style>
