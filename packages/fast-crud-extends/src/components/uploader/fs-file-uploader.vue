<template>
  <div class="fs-file-uploader" :class="{ 'fs-file-uploader-limit': computedOnLimit }">
    <component
      :is="$fsui.upload.name"
      v-model:fileList="fileList"
      :custom-request="customRequest"
      :before-upload="onBeforeUpload"
      :list-type="listType"
      v-bind="$attrs"
      @change="handleChange"
      @preview="handlePreview"
    >
      <component :is="computedFileSelectBtn.is" v-bind="computedFileSelectBtn" />
    </component>
    <component :is="computedUploaderImpl" ref="uploaderImplRef" />
    <component :is="$fsui.dialog.name" v-model:[$fsui.dialog.visible]="previewVisible" :footer="null" v-bind="preview">
      <img style="width: 100%" :src="previewImage" />
    </component>
  </div>
</template>

<script>
import { computed, ref, watch, getCurrentInstance } from "vue";
import { useUploader } from "./uploader-impl";
import { uiContext, utils, useI18n } from "@fast-crud/fast-crud";
import _ from "lodash-es";
const logger = utils.logger;
export default {
  name: "FsFileUploader",
  inheritAttrs: false,
  props: {
    modelValue: {},
    limit: {},
    sizeLimit: {},
    buildUrl: {
      default() {
        return (value) => {
          return value;
        };
      }
    },
    button: {},
    listType: {},
    beforeUpload: {},
    uploader: {},
    preview: {},
    valueType: {
      type: String, // url ,key, object
      default: "object"
    } //''
  },
  emits: ["change", "update:modelValue"],
  setup(props, ctx) {
    const ui = uiContext.get();
    const { t } = useI18n();
    const fileList = ref([]);
    const currentValue = ref();
    function pickFileName(url) {
      return url.substring(url.lastIndexOf("/") + 1);
    }
    function buildOneToFile(value) {
      if (typeof value === "string") {
        return {
          value,
          name: pickFileName(value),
          url: props.buildUrl(value),
          uid: Math.random()
        };
      }

      return value;
    }
    function buildOneToValue(file) {
      const value = {
        size: file.size,
        name: file.name,
        uid: file.uid,
        ...(file.response ? file.response : file)
      };
      if (props.valueType === "object") {
        return value;
      }
      return file[props.valueType];
    }
    function initValue(value) {
      const array = [];
      if (value == null || value.length === 0) {
        fileList.value = array;
        return;
      }
      if (value instanceof Array) {
        _.forEach(value, (item) => {
          array.push(buildOneToFile(item));
        });
      }
      fileList.value = array;
    }

    initValue(props.modelValue);

    function onChange(value) {
      ctx.emit("change", value);
    }
    function onInput(value) {
      currentValue.value = value;
      console.log("emit value", value);
      ctx.emit("update:modelValue", value);
    }

    watch(
      () => {
        return props.modelValue;
      },
      (value) => {
        onChange(value);
        if (value === currentValue.value) {
          return;
        }
        initValue(value);
      }
    );

    function buildEmitValue(fileList) {
      if (props.limit === 1) {
        //单个文件
        return buildOneToFile(fileList[0]);
      }
      const array = [];
      _.forEach(fileList, (item) => {
        array.push(buildOneToValue(item));
      });
      return array;
    }
    function isUploadSuccess(change) {
      return change.file.status === "done";
    }
    function hasUploading() {
      const uploading = fileList.value.filter((item) => {
        return item.status === "uploading";
      });
      return uploading.length > 0;
    }
    function handleChange(change) {
      if (!isUploadSuccess(change)) {
        return;
      }
      const { fileList } = change;
      onInput(buildEmitValue(fileList));
    }

    const uploaderImplRef = ref();
    const computedUploaderImpl = computed(() => {
      const { proxy } = getCurrentInstance();
      const { getDefaultType, getUploaderImpl } = useUploader(proxy);
      const type = props.uploader?.type || getDefaultType();
      return getUploaderImpl(type);
    });

    function computeFileSize(fileSize) {
      let sizeTip = fileSize;
      if (fileSize > 1024 * 1024 * 1024) {
        sizeTip = (fileSize / (1024 * 1024 * 1024)).toFixed(2) + "G";
      } else if (fileSize > 1024 * 1024) {
        sizeTip = (fileSize / (1024 * 1024)).toFixed(2) + "M";
      } else {
        sizeTip = Math.round(fileSize / 1024) + "K";
      }
      return sizeTip;
    }

    const computedOnLimit = computed(() => {
      return props.limit > 0 && fileList.value.length >= props.limit;
    });

    function checkLimit() {
      if (computedOnLimit.value) {
        ui.message.warn(t("fs.extends.fileUploader.limitTip", [props.limit]));
        throw new Error("文件数量超限");
      }
    }

    async function onBeforeUpload(file) {
      checkLimit();
      if (props.sizeLimit != null) {
        let limit = props.sizeLimit;
        let showMessage = null;
        if (typeof props.sizeLimit === "number") {
          showMessage = (fileSize, limit) => {
            const limitTip = computeFileSize(limit);
            const fileSizeTip = computeFileSize(file.size);
            ui.message.warn(t("fs.extends.fileUploader.sizeLimitTip", [limitTip, fileSizeTip]));
          };
        } else {
          limit = props.sizeLimit.limit;
          showMessage = props.sizeLimit.tip;
        }
        if (file.size > limit) {
          logger.debug("文件大小超过限制：", file.size);
          showMessage(file.size, limit);
          throw new Error("文件大小超过限制：" + file.size);
        }
      }
    }

    async function doUpload(option) {
      option.options = props.uploader;
      return await uploaderImplRef.value.upload(option);
    }
    async function customRequest({ file, onProgress, onSuccess, onError }) {
      console.log("customReq", file);
      const option = {
        file,
        fileName: file.name,
        onProgress
      };
      try {
        const ret = await doUpload(option);
        onSuccess(ret);
      } catch (e) {
        logger.error("上传失败", e);
        onError(e);
      }
    }

    const computedFileSelectBtn = computed(() => {
      if (props.listType === "picture-card") {
        return {
          is: "FsIcon",
          icon: ui.icons.plus
        };
      }
      return {
        is: "FsButton",
        icon: ui.icons.upload,
        text: t("fs.extends.fileUploader.text")
      };
    });

    const previewVisible = ref(false);
    const previewImage = ref();
    function getBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });
    }
    const handlePreview = async (file) => {
      if (!file.url && !file.preview && file.originFileObj) {
        file.preview = await getBase64(file.originFileObj);
      }
      previewImage.value = file.url || file.preview;
      previewVisible.value = true;
    };
    return {
      fileList,
      initValue,
      onChange,
      onInput,
      handleChange,
      hasUploading,
      computedUploaderImpl,
      uploaderImplRef,
      customRequest,
      onBeforeUpload,
      computedFileSelectBtn,
      previewVisible,
      previewImage,
      handlePreview,
      computedOnLimit
    };
  }
};
</script>
<style lang="less">
.fs-file-uploader {
  &.fs-file-uploader-limit {
    .ant-upload-select-picture-card {
      display: none;
    }
  }
}
</style>
