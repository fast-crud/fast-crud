<template>
  <component
    :is="$fsui.dialog.name"
    class="fs-cropper-uploader"
    append-to-body
    :close-on-click-modal="true"
    ref="cropperDialog"
    v-bind="dialogBinding"
  >
    <div class="cropper-uploader-wrap">
      <input
        type="file"
        v-show="false"
        ref="fileinput"
        :accept="accept"
        @change="handleChange"
      />
      <!-- step1 -->
      <div
        class="cropper-uploader__choose cropper-uploader_left"
        v-show="!isLoaded"
      >
        <fs-button round @click="handleClick" text="+选择图片" />
        <p>{{ _uploadTip }}</p>
      </div>
      <!-- step2 -->
      <div
        class="cropper-uploader__edit cropper-uploader_left"
        v-show="isLoaded"
      >
        <div class="cropper-uploader__edit-area">
          <vue-cropper
            ref="cropper"
            :src="imgSrc"
            preview=".preview"
            :style="{ height: _cropperHeight }"
            v-bind="_cropper"
          />
        </div>
        <div class="tool-bar">
          <component :is="$fsui.buttonGroup.name">
            <fs-button
              round
              size="mini"
              icon="el-icon-edit"
              @click="handleClick"
              text="重新选择"
            />
            >
            <fs-button
              round
              size="mini"
              type=""
              @click="flipX"
              text="左右翻转"
            />
            <fs-button
              round
              size="mini"
              type=""
              @click="flipY"
              text="上下翻转"
            />
            <fs-button
              round
              size="mini"
              type=""
              icon="el-icon-zoom-in"
              @click="zoom(0.1)"
            />
            <fs-button
              round
              size="mini"
              type=""
              icon="el-icon-zoom-out"
              @click="zoom(-0.1)"
            />
            <fs-button
              round
              size="mini"
              type=""
              icon="el-icon-refresh-right"
              @click="rotate(90)"
              text="旋转"
            />
            <fs-button
              round
              size="mini"
              type=""
              icon="el-icon-refresh"
              @click="reset"
              text="重置"
            />
          </component>
        </div>
      </div>
      <div class="cropper-uploader__preview">
        <span class="cropper-uploader__preview-title">预览</span>
        <div class="cropper-uploader__preview-120 preview"></div>
        <div
          class="cropper-uploader__preview-65 preview"
          :class="{ round: _cropper.aspectRatio === 1 }"
        ></div>
      </div>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <fs-button @click="handleClose" size="mini" text="取消" />
        <fs-button
          type="primary"
          size="mini"
          @click="doCropper()"
          text="确定"
        />
      </div>
    </template>
  </component>
</template>

<script>
import { ref } from "vue";
import VueCropper from "vue-cropperjs";
import "cropperjs/dist/cropper.css";
import log from "../../../../utils/util.log";
import { uiContext } from "@fast-crud/fast-crud";
// 图片裁剪对话框，封装cropperjs
export default {
  name: "FsCropper",
  components: {
    VueCropper,
  },
  props: {
    // 对话框标题
    title: {
      type: String,
      default: "图片裁剪",
    },
    // cropper的高度，默认为浏览器可视窗口高度的40%，最小270
    cropperHeight: {
      type: [String, Number],
    },
    // 对话框宽度，默认50%
    dialogWidth: {
      type: [String, Number],
      default: "50%",
    },
    // 图片大小限制，单位MB，0为不限制
    maxSize: {
      type: Number,
      default: 5,
    },
    // 上传提示
    uploadTip: {
      type: String,
    },
    // cropperjs的参数，详见：https://github.com/fengyuanchen/cropperjs
    cropper: {
      type: Object,
    },
    // 可接收的文件后缀
    accept: {
      type: String,
      default: ".jpg, .jpeg, .png, .gif, .webp",
    },
    // 输出类型，blob,dataUrl,all
    output: {
      type: String,
      default: "blob", // blob
    },
  },
  emits: ["cancel", "done"],
  setup() {
    const ui = uiContext.get();
    const cropperVisible = ref(false);
    const visible = ui.dialog.visible;
    const vVisible = {
      [visible]: cropperVisible.value,
      ["onUpdate:" + visible]: (value) => {
        cropperVisible.value = value;
      },
    };
    const vClosed = ui.dialog.buildOnClosedBind(this.handleClosed);
    const customClass = ui.dialog.customClass;
    const dialogBinding = ref({
      ...vVisible,
      ...vClosed,
      [customClass]: "fs-cropper-dialog",
    });

    return {
      dialogBinding,
    };
  },
  data() {
    return {
      isLoaded: false,
      imgSrc: "",
      data: null,
      file: undefined,
      scale: {
        x: 1,
        y: 1,
      },
    };
  },
  computed: {
    _uploadTip() {
      if (this.uploadTip != null && this.uploadTip !== "") {
        return this.uploadTip;
      }
      if (this.maxSize > 0) {
        return `只支持${this.accept.replace(/,/g, "、")},大小不超过${
          this.maxSize
        }M`;
      } else {
        return `只支持${this.accept},大小无限制`;
      }
    },
    _cropper() {
      const def = {
        aspectRatio: 1,
        ready: this.ready,
      };
      if (this.cropper == null) {
        return def;
      }
      const assign = Object.assign(def, this.cropper);
      log.debug("cropper options:", assign);
      return assign;
    },
    _cropperHeight() {
      let height = this.cropperHeight;
      if (height == null) {
        height = document.documentElement.clientHeight * 0.55;
        if (height < 270) {
          height = 270;
        }
      }
      if (typeof height === "number") {
        height += "px";
      }
      return height;
    },
    _dialogWidth() {
      let width = this.dialogWidth;
      if (width == null) {
        width = "50%";
      }
      if (typeof width === "number") {
        width += "px";
      }
      return width;
    },
  },
  methods: {
    open(url) {
      this.dialogVisible = true;
      if (url != null && url !== "") {
        this.imgSrc = url;
      }
    },
    close() {
      this.dialogVisible = false;
    },
    clear() {
      this.isLoaded = false;
      if (this.$refs.fileinput != null) {
        this.$refs.fileinput.value = null;
      }
      if (this.$refs.cropper != null) {
        this.$refs.cropper.clear();
      }
    },
    // 获取vue-cropper组件对象
    getCropper() {
      return this.$refs.cropper;
    },
    ready(event) {
      log.debug("cropper ready:", event);
      // this.zoom(-0.3)
    },
    preventDefault(e) {
      e.preventDefault();
      return false;
    },
    // 点击按钮打开文件资源窗口
    handleClick() {
      this.$refs.fileinput.click();
    },
    // 检测选择的文件是否合适
    checkFile(file) {
      // 仅限图片
      if (file.type.indexOf("image") === -1) {
        this.$message({
          message: "请选择合适的文件类型",
          type: "warning",
        });
        return false;
      }
      // 超出大小
      if (this.maxSize > 0 && file.size / 1024 / 1024 > this.maxSize) {
        this.$message({
          message: "图片大小超出最大限制（" + this.maxSize + "MB），请重新选择",
          type: "warning",
        });
        return false;
      }
      return true;
    },

    // 触发input框的change事件选择图片
    handleChange(e) {
      e.preventDefault();
      const files = e.target.files || e.dataTransfer.files;
      this.isLoaded = true;
      const file = files[0];
      if (this.checkFile(file)) {
        this.file = file;
        this.setImage(e);
        // setTimeout(() => {
        //   this.zoom(-0.3)
        // }, 1)
      }
    },
    // 点击关闭弹窗
    handleClosed() {
      this.$emit("cancel");
    },
    doCropper() {
      if (!this.isLoaded) {
        this.$message("请先选择图片");
        return;
      }
      this.dialogVisible = false;
      this.doOutput(this.file);
    },
    doOutput(file) {
      log.debug("output this:", this);
      const ret = { file };
      if (this.output === "all") {
        this.getCropImageBlob((blob) => {
          const dataUrl = this.cropImageDataUrl();
          ret.blob = blob;
          ret.dataUrl = dataUrl;
          this.$emit("done", ret);
        });
      }

      if (this.output === "blob") {
        this.getCropImageBlob((blob) => {
          ret.blob = blob;
          this.$emit("done", ret);
        });
      }
      if (this.output === "dataUrl") {
        ret.dataUrl = this.cropImageDataUrl();
        this.$emit("done", ret);
      }
    },
    emit(result) {
      this.$emit("done", result);
    },
    cropImageDataUrl() {
      // get image data for post processing, e.g. upload or setting image src
      return this.$refs.cropper.getCroppedCanvas().toDataURL();
    },
    getCropImageBlob(callback, type, quality) {
      this.$refs.cropper.getCroppedCanvas().toBlob(callback, type, quality);
    },
    flipX() {
      this.$refs.cropper.scaleX((this.scale.x *= -1));
    },
    flipY() {
      this.$refs.cropper.scaleY((this.scale.y *= -1));
    },
    getCropBoxData() {
      this.data = JSON.stringify(this.$refs.cropper.getCropBoxData(), null, 4);
    },
    getData() {
      this.data = JSON.stringify(this.$refs.cropper.getData(), null, 4);
    },
    move(offsetX, offsetY) {
      this.$refs.cropper.move(offsetX, offsetY);
    },
    reset() {
      this.$refs.cropper.reset();
    },
    rotate(deg) {
      this.$refs.cropper.rotate(deg);
    },
    setCropBoxData() {
      if (!this.data) return;
      this.$refs.cropper.setCropBoxData(JSON.parse(this.data));
    },
    setData() {
      if (!this.data) return;
      this.$refs.cropper.setData(JSON.parse(this.data));
    },
    setImage(e) {
      const file = e.target.files[0];
      if (file.type.indexOf("image/") === -1) {
        this.$message("Please select an image file");
        return;
      }
      if (typeof FileReader === "function") {
        const reader = new FileReader();
        reader.onload = (event) => {
          this.imgSrc = event.target.result;
          // rebuild cropperjs with the updated source
          this.$refs.cropper.replace(event.target.result);
        };
        reader.readAsDataURL(file);
      } else {
        this.$message("Sorry, FileReader API not supported");
      }
    },
    showFileChooser() {
      this.$refs.input.click();
    },
    zoom(percent) {
      this.$refs.cropper.relativeZoom(percent);
    },
  },
};
</script>

<style lang="less" scoped>
$area-height: 280px;
.fs-cropper-uploader {
  &-wrap {
    display: flex;
    justify-content: space-between;
    width: 100%;
    height: 100%;
  }

  &_left {
    font-size: 13px;
    color: #999999;
    position: relative;
    background: #ecf2f6;
    flex-grow: 5;
    margin: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }

  &__choose {
    p {
      width: 100%;
      text-align: center;
    }
  }

  &__edit {
    &-area {
      width: 100%;
      overflow: hidden;

      &-img {
        object-fit: cover;
      }
    }
    .tool-bar {
      margin: 10px;
      position: absolute;
      bottom: -50px;
    }
  }

  $top: 30px;

  &__preview {
    background: #ecf2f6;
    text-align: center;
    width: 200px;
    padding-top: $top;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 13px;
    margin: 10px;
    padding: 10px;
    &-title {
      color: #999999;
    }
    .preview {
      overflow: hidden;
      margin: 10px;
      border: 1px #cacaca solid;
    }
    .round {
      border-radius: 500px;
    }

    img {
      background: #fff;
      margin-top: 5px;
      border-radius: 500px;
    }

    &-120 {
      height: 120px;
      width: 120px;
    }

    &-65 {
      height: 65px;
      width: 65px;
    }

    &-40 {
      height: 30px;
      width: 30px;
    }
  }
}
</style>
