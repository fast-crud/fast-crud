<template>
  <div class="fs-cropper-uploader" :class="{ 'is-disabled': computedProps.disabled }">
    <div class="image-list">
      <component :is="ui.imageGroup.name">
        <div v-for="(item, index) in listRef" :key="index" class="image-item">
          <component :is="ui.image.name" class="image" :src="getImageSrc(item)" v-bind="computedProps.img">
            <template #placeholder>
              <div class="image-slot">
                <fs-loading :loading="true" />
              </div>
            </template>
          </component>
          <div class="delete">
            <fs-icon v-if="!computedProps.disabled" :icon="ui.icons.remove" @click="removeImage(index as number)" />
            <fs-icon :icon="ui.icons.search" @click="preview(item)" />
          </div>
          <div v-if="item.status === 'uploading'" class="status-uploading">
            <component :is="ui.progress.name" type="circle" :percentage="item.progress" :width="70" />
          </div>
          <div v-else-if="item.status === 'done'" class="status-done">
            <fs-icon :icon="ui.icons.check" class="status-down-icon" />
          </div>
        </div>
        <div
          v-if="computedProps.limit <= 0 || computedProps.limit > listRef.length"
          class="image-item image-plus"
          @click="addNewImage"
        >
          <fs-icon :icon="ui.icons.plus" class="cropper-uploader-icon" />
        </div>
      </component>
    </div>
    <fs-cropper
      ref="cropperRef"
      :title="computedProps.title"
      :cropper-height="computedProps.cropperHeight"
      :dialog-width="computedProps.dialogWidth"
      :accept="computedProps.accept"
      :upload-tip="computedProps.uploadTip"
      :max-size="computedProps.maxSize"
      :cropper="computedProps.cropper"
      :compress-quality="computedProps.compressQuality"
      output="all"
      @done="cropComplete"
      @ready="doReady"
    />
    <div class="fs-cropper-preview" :class="{ open: previewVisible }" @click="closePreview">
      <div class="fs-cropper-preview-content">
        <img v-if="previewUrl" :src="previewUrl" class="preview-image" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, getCurrentInstance, reactive, ref, Ref, watch } from "vue";
import { useUi } from "@fast-crud/fast-crud";
import { FsUploaderDoUploadOptions } from "../d/type";
import { useUploader } from "./utils";

/**
 * 图片裁剪上传组件,封装了fs-cropper
 * fs-cropper内部封装了[cropperjs](https://github.com/fengyuanchen/cropperjs)
 */
export default defineComponent({
  name: "FsCropperUploader",
  props: {
    /**
     * 初始图片url,或者是数组
     */
    modelValue: {
      type: [String, Object, Array]
    },
    img: {},
    /**
     * 上传后端类型，[form, cos, qiniu , alioss]
     */
    type: {
      type: String
    },
    /**
     *  上传提示
     */
    uploadTip: {
      type: String
    },
    /**
     * 对话框标题
     */
    title: String,
    /**
     * cropper的高度，默认为浏览器可视窗口高度的40%，最小270
     */
    cropperHeight: {
      type: [String, Number]
    },
    /**
     * 对话框宽度，默认50%
     */
    dialogWidth: {
      type: [String, Number],
      default: "50%"
    },
    /**
     * 图片大小限制，单位MB
     */
    maxSize: {
      type: Number,
      default: 5
    },
    /**
     * 图片数量限制,0为不限制
     */
    limit: {
      type: Number,
      default: 1
    },
    /**
     * 可接收的文件后缀
     */
    accept: {
      type: String,
      default: ".jpg, .jpeg, .png, .gif, .webp"
    },
    /**
     * [cropperjs的参数](https://github.com/fengyuanchen/cropperjs)
     */
    cropper: {
      type: Object
    },
    /**
     * FsUploaderXXX的配置，会临时覆盖全局上传配置参数
     */
    uploader: {
      type: Object
    },
    /**
     * 压缩质量
     */
    compressQuality: {
      type: Number,
      default: 0.8
    },
    /**
     *  构建下载url方法,不影响提交的value
     */
    buildUrl: {
      type: Function,
      default: async function (value: any) {
        return typeof value === "object" ? value.url : value;
      }
    },
    /**
     * 返回值类型
     * 支持：`[url,key,object]`
     */
    valueType: {
      type: String, // url ,key, object
      default: "url"
    },
    /**
     * 是否禁用
     */
    disabled: {}
  },
  emits: ["update:modelValue", "change", "ready"],
  setup(props: any, ctx: any) {
    const { ui } = useUi();
    const cropperRef: Ref = ref();
    const uploaderImplRef: Ref = ref();

    const indexRef: Ref = ref();
    const listRef: Ref = ref([]);
    const formValidator = ui.formItem.injectFormItemContext();
    // eslint-disable-next-line vue/no-setup-props-destructure
    // @ts-ignore
    let emitValue: any = props.modelValue;
    // eslint-disable-next-line vue/no-setup-props-destructure
    // @ts-ignore
    initValue(props.modelValue);

    async function initValue(value: any) {
      const list: any = [];
      if (value == null || value === "") {
        listRef.value = list;
        return;
      }
      if (typeof value === "string") {
        // @ts-ignore
        list.push({ url: await props.buildUrl(value), value: value, status: "done" });
      } else if (Array.isArray(value)) {
        for (const item of value) {
          // @ts-ignore
          list.push({ url: await props.buildUrl(item), value: item, status: "done" });
        }
      } else if (typeof value === "object") {
        // @ts-ignore
        list.push({ url: await props.buildUrl(value), value, status: "done" });
      } else {
        for (const item of value) {
          // @ts-ignore
          list.push({ url: await props.buildUrl(item), value: item, status: "done" });
        }
      }
      listRef.value = list;
    }
    function addNewImage() {
      // @ts-ignore
      if (props.disabled) {
        return;
      }
      indexRef.value = undefined;
      cropperRef.value.clear();
      cropperRef.value.open();
    }
    function removeImage(index: number) {
      listRef.value.splice(index, 1);
      doEmit();
    }
    function hasUploading() {
      const fileList: any = listRef.value;
      if (fileList && fileList.length > 0) {
        for (const item of fileList) {
          if (item.status === "uploading") {
            return true;
          }
        }
      }
      return false;
    }
    async function cropComplete(ret: any) {
      const blob = ret.blob;
      const dataUrl = ret.dataUrl;
      const file = ret.file;
      const filename = file.name;
      const blobFile = new File([blob], filename, { type: blob.type });

      // 开始上传
      const item: any = reactive({
        url: undefined,
        dataUrl: dataUrl,
        status: "uploading",
        progress: 0
      });
      const onProgress = (e: any) => {
        item.progress = e.percent;
      };
      const onError = (e: any) => {
        item.status = "error";
        item.message = "文件上传出错:" + e.message;
        console.error(e);
      };
      const option = {
        file: blobFile,
        onProgress,
        onError,
        fileName: filename
      };
      listRef.value.push(item);
      try {
        const uploaded = await doUpload(option);
        let value = uploaded;
        // @ts-ignore
        if (props.valueType !== "object") {
          // @ts-ignore
          value = uploaded[props.valueType];
        }
        // @ts-ignore
        item.url = await props.buildUrl(value);
        item.value = value;
        item.status = "done";
        doEmit();
      } catch (e) {
        onError(e);
      }
    }

    async function doUpload(option: FsUploaderDoUploadOptions) {
      // @ts-ignore
      option.options = props.uploader || {};
      const { getUploaderImpl } = useUploader();
      let uploaderRef = await getUploaderImpl(option.options.type);
      if (uploaderRef == null) {
        throw new Error("Sorry，The component is not ready yet");
      }
      return await uploaderRef?.upload(option);
    }

    async function doEmit() {
      const list = [];
      for (const item of listRef.value) {
        if (typeof item === "string") {
          list.push(item);
        } else {
          list.push(item.value);
        }
      }
      let ret = list;
      // @ts-ignore
      if (props.limit === 1) {
        ret = list && list.length > 0 ? list[0] : undefined;
      }
      emitValue = ret;
      ctx.emit("update:modelValue", ret);
      await formValidator.onChange();
      await formValidator.onBlur();
    }

    function getImageSrc(item: any) {
      return item.dataUrl ? item.dataUrl : item.url;
    }

    const previewVisible = ref(false);
    const previewUrl = ref();
    function preview(item: any) {
      previewVisible.value = true;
      previewUrl.value = getImageSrc(item);
    }
    function closePreview() {
      previewVisible.value = false;
      previewUrl.value = null;
    }
    watch(
      () => {
        // @ts-ignore
        return props.modelValue;
      },
      async (val: any) => {
        ctx.emit("change", val);
        if (val === emitValue) {
          return;
        }
        await initValue(val);
      }
    );
    const current = getCurrentInstance();
    function doReady(context: any) {
      ctx.emit("ready", {
        uploaderRef: current,
        ...context
      });
    }

    const computedProps = computed(() => {
      return {
        ...props
      };
    });
    return {
      ui,
      cropperRef,
      uploaderImplRef,
      indexRef,
      listRef,
      addNewImage,
      hasUploading,
      cropComplete,
      doUpload,
      removeImage,
      getImageSrc,
      previewUrl,
      previewVisible,
      preview,
      closePreview,
      doReady,
      computedProps
    };
  }
});
</script>

<style lang="less">
.fs-cropper-uploader {
  .fs-box {
    display: flex;
    flex-wrap: wrap;
  }
  .el-image-viewer__close {
    color: #fff;
  }
  &.is-disabled {
    .image-list {
      .image-item {
        cursor: not-allowed;
      }
    }
    i {
      cursor: not-allowed;
    }
  }
  .image-list {
    display: flex;
    justify-content: left;
    align-items: center;
    flex-wrap: wrap;
    .image-item {
      width: 100px;
      height: 100px;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #fbfdff;
      border: 1px solid #c0ccda;
      border-radius: 6px;
      position: relative;
      margin-right: 8px;
      margin-bottom: 8px;
      cursor: pointer;
      overflow: hidden;
      &.image-plus {
        border: 1px dashed #c0ccda;
      }
      .cropper-uploader-icon {
        vertical-align: top;
        font-size: 28px;
        color: #8c939d;
      }
      .image {
        width: 100px;
      }

      .delete {
        border-radius: 6px;
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        cursor: default;
        text-align: center;
        color: #fff;
        opacity: 0;
        font-size: 20px;
        background-color: rgba(0, 0, 0, 0.9);
        -webkit-transition: opacity 0.3s;
        transition: opacity 0.3s;
        &:hover {
          opacity: 0.9;
        }
        display: flex;
        justify-content: center;
        align-items: center;
        i {
          cursor: pointer;
        }

        display: flex;
        > * {
          margin: 5px;
        }
      }
      .status-uploading {
        border-radius: 6px;
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        cursor: default;
        text-align: center;
        color: #fff;
        opacity: 1;
        font-size: 20px;
        background-color: rgba(0, 0, 0, 0.5);
        -webkit-transition: opacity 0.3s;
        transition: opacity 0.3s;
        display: flex;
        justify-content: center;
        align-items: center;
        .el-progress {
          width: 70px;
          height: 70px;
          .el-progress__text {
            color: #fff;
          }
        }
      }
      .status-done {
        position: absolute;
        right: -15px;
        top: -6px;
        width: 40px;
        height: 24px;
        background: #13ce66;
        text-align: center;
        -webkit-transform: rotate(45deg);
        transform: rotate(45deg);
        -webkit-box-shadow: 0 0 1pc 1px rgba(0, 0, 0, 0.2);
        box-shadow: 0 0 1pc 1px rgba(0, 0, 0, 0.2);
        display: flex;
        justify-content: center;
        align-items: center;
        .status-down-icon {
          font-size: 12px;
          margin-top: 11px;
          color: #fff;
          -webkit-transform: rotate(-45deg);
          transform: rotate(-45deg);
        }
      }
    }
  }

  .fs-cropper-preview {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(183, 180, 180, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    visibility: hidden;
    z-index: 10000;
    &.open {
      visibility: visible;
    }
    .fs-cropper-preview-content {
      max-height: 800px;
      max-width: 800px;
      img {
        max-height: 800px;
        max-width: 800px;
        object-fit: contain;
      }
    }
  }
}
</style>
