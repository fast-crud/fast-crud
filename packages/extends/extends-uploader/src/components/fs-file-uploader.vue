<template>
  <div class="fs-file-uploader" :class="{ 'fs-file-uploader-limit': computedOnLimit() }">
    <component :is="$fsui.upload.name" v-model:fileList="fileList" v-bind="computedBinding">
      <component :is="computedFileSelectBtn.is" v-bind="computedFileSelectBtn" />
    </component>
    <component :is="computedUploaderImpl" ref="uploaderImplRef" />
    <component
      :is="$fsui.dialog.name"
      v-if="isPicture()"
      v-model:[$fsui.dialog.visible]="previewVisible"
      v-bind="computedPreview"
    >
      <img style="width: 100%" :src="previewImage" />
    </component>
  </div>
</template>

<script>
import { computed, ref, watch, getCurrentInstance } from "vue";
import { useUploader } from "./utils";
import { uiContext, useI18n } from "@fast-crud/fast-crud";
import _ from "lodash-es";
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
    /**
     * 上传按钮配置，参考FsButton参数
     */
    button: {},
    listType: {},
    beforeUpload: {},
    uploader: {},
    preview: {},
    /**
     * 返回值类型
     */
    valueType: {
      type: String, // url ,key, object
      default: "url"
    } //''
  },
  emits: ["change", "update:modelValue"],
  setup(props, ctx) {
    const ui = uiContext.get();
    const { t } = useI18n();
    const fileList = ref([]);
    const currentValue = ref();
    const fileListLocal = ref([]);
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
      return value[props.valueType];
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
      } else {
        array.push(buildOneToFile(value));
      }
      fileList.value = array;
    }

    initValue(props.modelValue);
    fileListLocal.value = fileList.value;

    function onChange(value) {
      ctx.emit("change", value);
    }
    function onInput(value) {
      currentValue.value = value;
      // fileList.value = value;
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

    function buildEmitValue(fList) {
      if (props.limit === 1) {
        //单个文件
        return buildOneToValue(fList[0]);
      }
      const array = [];
      _.forEach(fList, (item) => {
        array.push(buildOneToValue(item));
      });
      return array;
    }
    function hasUploading() {
      console.log("hasUploading", fileListLocal.value);
      const uploading = fileListLocal.value.filter((item) => {
        return item.status === ui.upload.status.uploading;
      });
      return uploading.length > 0;
    }
    function handleSuccess(list) {
      onInput(buildEmitValue(list));
    }

    function handleChange(list) {
      console.log("handleChange", list);
      fileListLocal.value = list;
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

    const computedOnLimit = (isCheck = false) => {
      const add = isCheck ? ui.upload.limitAdd : 0;
      return props.limit > 0 && fileListLocal.value.length >= props.limit + add;
    };

    function showLimitTip() {
      ui.message.warn(t("fs.extends.fileUploader.limitTip", [props.limit]));
    }
    function checkLimit() {
      if (computedOnLimit(true)) {
        showLimitTip();
        throw new Error("文件数量超限");
      }
    }

    function checkSizeLimit(file) {
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
          console.log("文件大小超过限制：", file.size);
          showMessage(file.size, limit);
          throw new Error("文件大小超过限制：" + file.size);
        }
      }
    }

    const beforeUpload = async (file) => {
      checkLimit();
      checkSizeLimit(file);
    };

    async function doUpload(option) {
      option.options = props.uploader;
      return await uploaderImplRef.value.upload(option);
    }
    async function customRequest(context) {
      const { file, onProgress, onSuccess, onError } = context;
      const option = {
        file,
        fileName: file.name,
        onProgress
      };
      try {
        const ret = await doUpload(option);
        onSuccess(ret);
      } catch (e) {
        console.error("上传失败", e);
        onError(e);
      }
    }

    const computedFileSelectBtn = computed(() => {
      if (isPictureCard()) {
        return {
          is: "FsIcon",
          icon: ui.icons.plus
        };
      }
      return {
        is: "FsButton",
        icon: ui.icons.upload,
        text: t("fs.extends.fileUploader.text"),
        ...props.button
      };
    });

    const previewVisible = ref(false);
    const previewImage = ref();
    const computedPreview = computed(() => {
      return {
        ...ui.dialog.footer(),
        ...props.preview
      };
    });
    function getBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });
    }
    function isPicture() {
      return props.listType === "picture-card" || props.listType === "picture";
    }
    function isPictureCard() {
      return props.listType === "picture-card";
    }
    const handlePreview = async (file) => {
      if (!isPicture()) {
        window.open(file.url, "_blank");
      }
      if (!file.url && !file.preview && file.originFileObj) {
        file.preview = await getBase64(file.originFileObj);
      }
      previewImage.value = file.url || file.preview;
      previewVisible.value = true;
    };

    function buildAntdvBinding() {
      return {
        customRequest: customRequest,
        beforeUpload,
        listType: props.listType,
        onChange: (change) => {
          const { fileList } = change;
          handleChange(fileList);
          console.log("change", change);
          let status = change.file?.status;
          if (status !== "done" && status !== "removed") {
            return;
          }
          handleSuccess(fileList);
        },
        onPreview: handlePreview
      };
    }

    function buildElementBinding() {
      return {
        action: "",
        "list-type": props.listType,
        "before-upload": beforeUpload,
        "http-request": customRequest,
        "on-exceed": () => {
          console.log("on exceed");
          checkLimit();
        },
        "on-remove": (file, fileList) => {
          handleChange(fileList);
          handleSuccess(fileList);
        },
        "on-change": (file, fileList) => {
          console.log("on change", file, fileList);
          handleChange(fileList);
        },
        "on-success": (res, file, fileList) => {
          if (res == null) {
            return;
          }
          console.log("on success", res, file, fileList);
          file.response = res;
          handleSuccess(fileList);
        },
        // "on-error": "handleUploadFileError",
        // "on-progress": "handleUploadProgress"
        "on-preview": handlePreview
      };
    }

    const computedBinding = computed(() => {
      const binding = ui.type === "antdv" ? buildAntdvBinding() : buildElementBinding();
      return {
        ...binding,
        ...ctx.attrs
      };
    });

    return {
      fileList,
      fileListLocal,
      initValue,
      onChange,
      onInput,
      hasUploading,
      isPicture,
      computedUploaderImpl,
      uploaderImplRef,
      computedFileSelectBtn,
      previewVisible,
      previewImage,
      computedPreview,
      computedOnLimit,
      computedBinding
    };
  }
};
</script>
<style lang="less">
.fs-file-uploader {
  // antdv
  &.fs-file-uploader-limit {
    .ant-upload-select-picture-card {
      display: none;
    }
  }

  // element
  .el-upload-list--picture-card .el-upload-list__item {
    width: 100px;
    height: 100px;
    //line-height: 100px;
  }
  .el-upload--picture-card {
    width: 100px;
    height: 100px;
    line-height: 100px;
  }
  &.fs-file-uploader-limit {
    .el-upload--picture-card {
      display: none;
    }
  }
  .el-upload--text {
    width: 100%;
    text-align: left;
    .el-upload-dragger {
      width: 100%;
      .el-button {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        .el-icon-upload {
          margin: 0;
          margin-bottom: 10px;
        }
      }
    }
  }
}
</style>
