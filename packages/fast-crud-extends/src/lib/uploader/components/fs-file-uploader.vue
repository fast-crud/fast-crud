<template>
  <div class="fs-file-uploader">
    <component
      :is="$fsui.upload.name"
      v-model:fileList="fileList"
      @change="handleChange"
      :customRequest="customRequest"
      :beforeUpload="onBeforeUpload"
      v-bind="$attrs"
    >
      <fs-button>
        <fs-icon :icon="$fsui.icons.upload" />
        Click to Upload
      </fs-button>
    </component>
    <component :is="computedUploaderImpl" ref="uploaderImplRef" />
  </div>
</template>

<script>
import { computed, ref, watch } from "vue";
import { useUploader } from "./uploader-impl";
import { uiContext, utils } from "@fast-crud/fast-crud";
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
      },
    },
    beforeUpload: {},
    uploader: {},
    valueType: {
      type: String, // url ,key, object
      default: "object",
    }, //''
  },
  emits: ["change", "update:modelValue"],
  setup(props, ctx) {
    const ui = uiContext.get();
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
          uid: Math.random(),
        };
      }

      return value;
    }
    function buildOneToValue(file) {
      const value = {
        size: file.size,
        name: file.name,
        uid: file.uid,
        ...(file.response ? file.response : file),
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
      if (change.file.status === "done") {
        return true;
      }
      return false;
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
      console.log("upload file change", change);
      const { fileList } = change;
      onInput(buildEmitValue(fileList));
    }

    const uploaderImplRef = ref();
    const computedUploaderImpl = computed(() => {
      const { getDefaultType, getUploaderImpl } = useUploader();
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

    async function onBeforeUpload(file, fileList) {
      if (props.limit > 0 && fileList.length >= props.limit) {
        throw new Error("文件数量超限");
      }
      if (props.sizeLimit != null) {
        let limit = props.sizeLimit;
        let showMessage = null;
        if (typeof props.sizeLimit === "number") {
          showMessage = (fileSize, limit) => {
            const limitTip = computeFileSize(limit);
            const fileSizeTip = computeFileSize(file.size);
            ui.message.warn(
              ` "文件大小不能超过${limitTip},当前文件大小:${fileSizeTip}`
            );
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
        onProgress,
      };
      try {
        const ret = await doUpload(option);
        onSuccess(ret);
      } catch (e) {
        logger.error("上传失败", e);
        onError(e);
      }
    }

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
    };
  },
};
</script>
