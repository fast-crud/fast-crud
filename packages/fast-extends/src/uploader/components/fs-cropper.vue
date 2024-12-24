<template>
  <component
    :is="ui.dialog.name"
    ref="cropperDialogRef"
    v-model:[ui.dialog.visible]="dialogVisible"
    append-to-body
    width="900px"
    :close-on-click-modal="true"
    v-bind="dialogBinding"
    :destroy-on-close="false"
  >
    <div class="fs-cropper-dialog-wrap">
      <input v-show="false" ref="fileInputRef" type="file" :accept="accept" @change="handleChange" />
      <!-- step1 -->
      <div v-show="!isLoaded" class="fs-cropper-dialog__choose fs-cropper-dialog_left">
        <fs-button round :text="computedTexts.chooseImage" @click="showFileChooser" />
        <p>{{ computedUploadTip }}</p>
      </div>
      <!-- step2 -->
      <div v-show="isLoaded" class="fs-cropper-dialog__edit fs-cropper-dialog_left">
        <div class="fs-cropper-dialog__edit-area">
          <vue-cropper
            ref="cropperRef"
            :src="imgSrc"
            preview=".preview"
            :style="{ height: _cropperHeight }"
            v-bind="_cropper"
          />
        </div>
        <div class="tool-bar">
          <component :is="ui.buttonGroup.name">
            <fs-button v-for="(item, index) of computedButtons" :key="index" v-bind="item" />
          </component>
        </div>
      </div>
      <div class="fs-cropper-dialog__preview">
        <span class="fs-cropper-dialog__preview-title">{{ computedTexts.preview }}</span>
        <div class="fs-cropper-dialog__preview-120 preview"></div>
        <div class="fs-cropper-dialog__preview-65 preview" :class="{ round: _cropper.aspectRatio === 1 }"></div>
      </div>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <fs-button size="small" :text="computedTexts.cancel" @click="handleClose" />
        <fs-button type="primary" size="small" :text="computedTexts.confirm" @click="doCropper()" />
      </div>
    </template>
  </component>
</template>

<script lang="ts">
import { computed, defineComponent, ref, Ref } from "vue";
import VueCropper from "./utils/vue-cropperjs.js";
import "cropperjs/dist/cropper.css";
import { useI18n, useUi } from "@fast-crud/fast-crud";

/**
 * 图片裁剪对话框
 * 内部封装了[cropperjs](https://github.com/fengyuanchen/cropperjs)
 */
export default defineComponent({
  name: "FsCropper",
  components: {
    VueCropper
  },
  props: {
    // 对话框标题
    title: {
      type: String
    },
    // cropper的高度，默认为浏览器可视窗口高度的40%，最小270
    cropperHeight: {
      type: [String, Number]
    },
    // 对话框宽度，默认50%
    dialogWidth: {
      type: [String, Number],
      default: "50%"
    },
    // 图片大小限制，单位MB，0为不限制
    maxSize: {
      type: Number,
      default: 5
    },
    // 上传提示
    uploadTip: {
      type: String
    },
    // cropperjs的参数，详见：https://github.com/fengyuanchen/cropperjs
    cropper: {
      type: Object
    },
    // 可接收的文件后缀
    accept: {
      type: String,
      default: ".jpg, .jpeg, .png, .gif, .webp"
    },
    // 输出类型，blob,dataUrl,all
    output: {
      type: String,
      default: "blob" // blob
    },
    compressQuality: {
      type: Number,
      default: 0.8
    }
  },
  emits: ["cancel", "done", "ready"],
  setup(props: any, ctx) {
    const { ui } = useUi();
    const { t } = useI18n();
    const dialogVisible: Ref = ref(false);
    const cropperRef: Ref = ref();
    const fileInputRef: Ref = ref();
    const isLoaded: Ref = ref(false);
    const imgSrc: Ref = ref();
    const data: Ref = ref();
    const file: Ref = ref();
    const scale: Ref = ref({
      x: 1,
      y: 1
    });
    // 点击关闭弹窗
    function handleClose() {
      dialogVisible.value = false;
    }

    function handleClosed() {
      clear();
      ctx.emit("cancel");
    }
    const vClosed = ui.dialog.buildOnClosedBind(handleClosed);
    const customClass = ui.dialog.customClass;
    const dialogBinding: Ref = computed(() => {
      return {
        ...vClosed,
        [customClass]: "fs-cropper-dialog",
        ...ui.formWrapper.buildWidthBind(ui.dialog.name, "960px"),
        ...ui.formWrapper.buildInitBind(ui.dialog.name),
        title: props.title || t("fs.extends.cropper.title")
      };
    });

    function open(url: string) {
      dialogVisible.value = true;
      if (url != null && url !== "") {
        imgSrc.value = url;
      }
    }
    function close() {
      dialogVisible.value = false;
    }
    function clear() {
      isLoaded.value = false;
      if (fileInputRef.value != null) {
        fileInputRef.value.value = null;
        fileInputRef.value = null;
      }
      if (cropperRef.value != null) {
        cropperRef.value.clear();
      }
    }
    // 获取vue-cropper组件对象
    function getCropperRef() {
      return cropperRef.value;
    }
    const scope = {
      cropper: getCropperRef(),
      zoom,
      clear,
      close,
      open
    };

    function ready(event: any) {
      // this.zoom(-0.3)
      ctx.emit("ready", {
        event,
        ...scope
      });
    }
    function preventDefault(e: any) {
      e.preventDefault();
      return false;
    }
    // 点击按钮打开文件资源窗口
    function handleClick() {
      fileInputRef.value.click();
    }

    // 检测选择的文件是否合适
    function checkFile(file: File) {
      // 仅限图片
      if (file.type.indexOf("image") === -1) {
        ui.message.warn("请选择合适的文件类型");
        return false;
      }
      // 超出大小
      if (props.maxSize > 0 && file.size / 1024 / 1024 > props.maxSize) {
        ui.message.warn(`图片大小超出最大限制（${props.maxSize}MB），请重新选择.`);
        return false;
      }
      return true;
    }

    function setImage(e: any) {
      const selectFile = e.target.files[0];
      if (selectFile.type.indexOf("image/") === -1) {
        ui.message.warn("Please select an image file");
        return;
      }
      if (typeof FileReader === "function") {
        const reader = new FileReader();
        reader.onload = (event) => {
          imgSrc.value = event.target.result;
          // rebuild cropperjs with the updated source
          cropperRef.value.replace(event.target.result);
        };
        reader.readAsDataURL(selectFile);
      } else {
        ui.message.error("Sorry, FileReader API not supported");
      }
    }
    // 触发input框的change事件选择图片
    function handleChange(e: any) {
      e.preventDefault();
      const files = e.target.files || e.dataTransfer.files;
      if (files == null) {
        return;
      }
      isLoaded.value = true;
      const selectedFile = files[0];
      if (checkFile(selectedFile)) {
        file.value = selectedFile;
        setImage(e);
        // setTimeout(() => {
        //   this.zoom(-0.3)
        // }, 1)
      }
    }

    function getCropImageDataUrl(fileType: string, quality?: any) {
      // get image data for post processing, e.g. upload or setting image src
      if (quality == null) {
        quality = props.compressQuality;
      }
      return cropperRef.value.getCroppedCanvas().toDataURL(fileType, quality);
    }
    async function getCropImageBlob(type: string, quality?: any) {
      if (quality == null) {
        quality = props.compressQuality;
      }

      return new Promise((resolve, reject) => {
        function callback(blob: any) {
          resolve(blob);
        }
        cropperRef.value.getCroppedCanvas().toBlob(callback, type, quality);
      });
    }
    function emit(result: any) {
      ctx.emit("done", result);
    }
    async function doOutput(file: File) {
      const ret: any = { file };
      if (props.output === "all") {
        const blob = await getCropImageBlob(file.type);
        const dataUrl = getCropImageDataUrl(file.type);
        ret.blob = blob;
        ret.dataUrl = dataUrl;
        emit(ret);
        return;
      }

      if (props.output === "blob") {
        ret.blob = await getCropImageBlob(file.type);
        emit(ret);
        return;
      }
      if (props.output === "dataUrl") {
        ret.dataUrl = getCropImageDataUrl(file.type);
        emit(ret);
      }
    }

    async function doCropper() {
      if (!isLoaded.value) {
        ui.message.warn("请先选择图片");
        return;
      }
      await doOutput(file.value);
      dialogVisible.value = false;
    }

    function flipX() {
      cropperRef.value.scaleX((scale.value.x *= -1));
    }
    function flipY() {
      cropperRef.value.scaleY((scale.value.y *= -1));
    }
    function getCropBoxData() {
      data.value = JSON.stringify(cropperRef.value.getCropBoxData(), null, 4);
    }
    function getData() {
      data.value = JSON.stringify(cropperRef.value.getData(), null, 4);
    }
    function move(offsetX: any, offsetY: any) {
      cropperRef.value.move(offsetX, offsetY);
    }
    function reset() {
      cropperRef.value.reset();
    }
    function rotate(deg: any) {
      cropperRef.value.rotate(deg);
    }
    function setCropBoxData() {
      cropperRef.value.setCropBoxData(JSON.parse(data.value));
    }
    function setData() {
      cropperRef.value.setData(JSON.parse(data.value));
    }

    function showFileChooser() {
      fileInputRef.value.click();
    }
    function zoom(percent: any) {
      cropperRef.value.relativeZoom(percent);
    }

    const computedButtons = computed(() => {
      const size = "small";
      const round = true;
      const buttons = [
        {
          size,
          round,
          icon: ui.icons.edit,
          text: t("fs.extends.cropper.reChoose"),
          onClick() {
            handleClick();
          }
        },
        {
          size,
          round,
          text: t("fs.extends.cropper.flipX"),
          onClick() {
            flipX();
          }
        },
        {
          size,
          round,
          text: t("fs.extends.cropper.flipY"),
          onClick() {
            flipY();
          }
        },
        {
          size,
          round,
          icon: ui.icons.zoomIn,
          onClick() {
            zoom(0.1);
          }
        },
        {
          size,
          round,
          icon: ui.icons.zoomOut,
          onClick() {
            zoom(-0.1);
          }
        },
        {
          size,
          round,
          icon: ui.icons.refreshLeft,
          onClick() {
            rotate(90);
          }
        },
        {
          size,
          round,
          icon: ui.icons.refreshRight,
          onClick() {
            rotate(-90);
          }
        },
        {
          size,
          round,
          icon: ui.icons.refresh,
          text: t("fs.extends.cropper.reset"),
          onClick() {
            reset();
          }
        }
      ];

      return buttons;
    });

    const computedTexts = computed(() => {
      return {
        title: t("fs.extends.cropper.title"),
        preview: t("fs.extends.cropper.preview"),
        cancel: t("fs.extends.cropper.cancel"),
        confirm: t("fs.extends.cropper.confirm"),
        chooseImage: t("fs.extends.cropper.chooseImage")
      };
    });

    const computedUploadTip = computed(() => {
      if (props.uploadTip != null && props.uploadTip !== "") {
        return props.uploadTip;
      }
      if (props.maxSize > 0) {
        return `${t("fs.extends.cropper.onlySupport")} ${props.accept.replace(/,/g, "、")},
        ${t("fs.extends.cropper.sizeLimit")} ${props.maxSize}M`;
      } else {
        return `${t("fs.extends.cropper.onlySupport")}${props.accept},${t("fs.extends.cropper.sizeNoLimit")}`;
      }
    });
    return {
      ui,
      cropperRef,
      fileInputRef,
      dialogVisible,
      dialogBinding,
      isLoaded,
      imgSrc,
      data,
      file,
      scale,
      computedButtons,
      handleClose,
      setData,
      handleClosed,
      close,
      showFileChooser,
      zoom,
      setCropBoxData,
      rotate,
      reset,
      move,
      getData,
      getCropBoxData,
      flipY,
      flipX,
      doCropper,
      doOutput,
      getCropImageBlob,
      getCropImageDataUrl,
      handleChange,
      setImage,
      checkFile,
      handleClick,
      preventDefault,
      open,
      clear,
      getCropperRef,
      ready,
      computedTexts,
      computedUploadTip
    };
  },
  data() {
    return {};
  },
  computed: {
    _cropper() {
      const def: any = {
        aspectRatio: 1,
        ready: this.ready
      };
      if (this.cropper == null) {
        return def;
      }
      const assign = Object.assign(def, this.cropper);
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
        return height + "px";
      }
      return height;
    },
    _dialogWidth() {
      let width = this.dialogWidth;
      if (width == null) {
        width = "50%";
      }
      if (typeof width === "number") {
        return width + "px";
      }
      return width;
    }
  }
});
</script>

<style lang="less">
//@width: 10px;
//@height: @width + 10px;
.fs-cropper-dialog {
  n-button-group {
    display: flex;
    button {
      margin: 0 2px;
    }
  }
  &-wrap {
    display: flex;
    justify-content: space-between;
    width: 100%;
    height: 100%;
    padding-bottom: 20px;
  }
  .dialog-footer {
    > .fs-button {
      margin: 2px;
    }
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

  &__preview {
    background: #ecf2f6;
    text-align: center;
    width: 200px;
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
      margin: auto !important;
      border-radius: 0 !important;
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
