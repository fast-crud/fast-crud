<template>
  <div class="fs-file-uploader" :class="{ 'fs-file-uploader-limit': computedOnLimit() }">
    <component :is="$fsui.upload.name" ref="fileUploaderRef" v-model:fileList="fileList" v-bind="computedBinding">
      <component :is="computedFileSelectBtn.is" v-bind="computedFileSelectBtn" />
    </component>
    <fs-uploader ref="uploaderImplRef" :type="uploader?.type" />
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

<script lang="ts">
import { computed, ref, watch } from "vue";
import { uiContext, useI18n } from "@fast-crud/fast-crud";
import _ from "lodash-es";
import FsUploader from "./fs-uploader.vue";
import { FileItem } from "../d.ts/type";

/**
 * 文件上传组件
 * 支持对应ui库的[x]-file-uploader组件的配置
 */
export default {
  name: "FsFileUploader",
  components: { FsUploader },
  inheritAttrs: false,
  props: {
    /**
     * value
     */
    modelValue: {},
    /**
     * 限制文件数量
     * 当限制数量>1时，返回值为数组
     */
    limit: {
      type: Number
    },
    /**
     * 文件大小限制，单位：字节
     * 可以直接传一个数字，也可以传 {limit:number,tip:'自定义提示文本'}
     */
    sizeLimit: {
      type: [Number, Object]
    },
    /**
     * 构建url的方法
     * 后台返回key之后，将其build成一个可访问的url，用于反显
     */
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
    button: {
      type: Object
    },
    /**
     * 展示模式，对应[x]-uploader组件的 listType参数
     */
    listType: {
      type: String
    },
    /**
     * 上传前的判断操作
     */
    beforeUpload: {
      type: Function
    },

    /**
     * 上传请求前的操作，可以压缩图片等
     * type: `async (context)=>{}`
     */
    beforeUploadRequest: {
      type: Function
    },
    /**
     * fs-uploader的配置
     */
    uploader: {
      type: Object
    },
    /**
     * 预览配置
     */
    preview: {
      type: Object
    },
    /**
     * 返回值类型
     * 支持：`[url,key,object]`
     */
    valueType: {
      type: String, // url ,key, object
      default: "url"
    }
  },
  emits: ["change", "update:modelValue", "success", "exceed"],
  setup(props, ctx) {
    const ui = uiContext.get();
    const { t } = useI18n();
    // uploader 的 modelValue
    const fileList = ref([]);
    const fileLocalList = ref([]);
    const currentValue = ref();
    const fileUploaderRef = ref();

    function pickFileName(url) {
      return url.substring(url.lastIndexOf("/") + 1);
    }
    async function buildOneToFile(value) {
      let fileValue;
      if (typeof value === "string") {
        fileValue = {
          url: undefined,
          key: value,
          value
        };
      } else {
        fileValue = value;
      }
      if (!fileValue.url) {
        const key = fileValue.key || fileValue.value;
        fileValue.url = await props.buildUrl(key);
      }
      if (!fileValue.name) {
        const url = fileValue.url;
        fileValue.name = pickFileName(url);
      }
      if (!fileValue[ui.upload.id]) {
        fileValue[ui.upload.id] = Math.random() + "";
      }
      if (!fileValue.status) {
        fileValue.status = ui.upload.status.success;
      }
      return fileValue;
    }
    async function buildOneToValue(file) {
      const res = file.response || file.fsRes;
      const value: FileItem = {
        size: file.size,
        name: file.name,
        uid: file.uid,
        ...(res != null ? res : file)
      };
      if (!value.url) {
        value.url = await props.buildUrl(value.key);
      }
      if (props.valueType === "object") {
        return value;
      }
      return value[props.valueType];
    }
    async function initFileList(value) {
      const array: any = [];
      if (value == null || value.length === 0) {
        fileList.value = array;
        return;
      }
      if (value instanceof Array) {
        for (let item of value) {
          array.push(await buildOneToFile(item));
        }
      } else {
        array.push(await buildOneToFile(value));
      }
      updateFileList(array);
    }

    async function emitValue(list) {
      let value = await buildEmitValue(list);
      onInput(value);
      onChange(value);
    }

    async function buildEmitValue(fList) {
      if (fList == null || fList.length === 0) {
        return [];
      }
      if (props.limit === 1) {
        //单个文件
        return await buildOneToValue(fList[0]);
      }
      const array: any = [];
      for (let item of fList) {
        if (ui.upload.isSuccess(item)) {
          array.push(await buildOneToValue(item));
        }
      }
      return array;
    }

    function onChange(value) {
      ctx.emit("change", value);
    }
    function onInput(value) {
      currentValue.value = value;
      ctx.emit("update:modelValue", value);
    }

    watch(
      () => {
        return props.modelValue;
      },
      (value) => {
        if (value === currentValue.value) {
          return;
        }
        initFileList(value);
      },
      {
        immediate: true
      }
    );

    function hasUploading() {
      const uploading = fileList.value.filter((item: any) => {
        return item.status === ui.upload.status.uploading;
      });
      return uploading.length > 0;
    }

    function handleChange(file, list) {
      updateFileList(list);
      emitValue(list);
    }

    function handleSuccess(res, file, list) {
      ctx.emit("success", { res, file, fileList: list });
      handleChange(file, list);
    }

    const uploaderImplRef = ref();

    function formatFileSize(fileSize) {
      let sizeTip;
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
      return props.limit > 0 && fileList.value.length >= props.limit + add;
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
        let showMessage: any = null;
        if (typeof props.sizeLimit === "number") {
          showMessage = (fileSize, limit) => {
            const limitTip = formatFileSize(limit);
            const fileSizeTip = formatFileSize(file.size);
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

    const beforeUpload = async (file, list = fileList.value) => {
      if (props.beforeUpload) {
        const ret = await props.beforeUpload({ file, fileList: fileList.value });
        if (ret === false) {
          return;
        }
      }
      try {
        checkLimit();
        checkSizeLimit(file);
      } catch (e) {
        return false;
      }
    };

    function updateFileList(list) {
      fileList.value = list;
    }

    async function doUpload(option) {
      option.options = props.uploader;
      let uploaderRef = uploaderImplRef.value.getUploaderRef();
      if (uploaderRef == null) {
        ui.message.warn("Sorry，The uploader component is not ready yet");
        throw new Error("Sorry，The component is not ready yet");
      }
      return await uploaderRef?.upload(option);
    }
    async function customRequest(context) {
      if (props.beforeUploadRequest) {
        await props.beforeUploadRequest(context);
      }

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
      return props.listType === ui.upload.typeImageCard || props.listType === ui.upload.typeImage;
    }
    function isPictureCard() {
      return props.listType === ui.upload.typeImageCard;
    }
    const handlePreview = async (file) => {
      if (!isPicture()) {
        let url;
        if (file.url) {
          url = file.url;
        } else {
          if (ui.type === "antdv") {
            url = file.response?.url;
          } else if (ui.type === "element") {
            url = file.fsRes?.url;
          } else {
            url = file.url;
          }
        }
        window.open(url, "_blank");
      }
      if (!file.url && !file.preview && file.originFileObj) {
        file.preview = await getBase64(file.originFileObj);
      }
      previewImage.value = file.url || file.preview;
      previewVisible.value = true;
    };

    function buildAntdvBinding() {
      return {
        customRequest,
        beforeUpload,
        listType: props.listType,
        onChange: (change) => {
          const { file, fileList } = change;
          handleChange(file, fileList);
        },
        onPreview: handlePreview
      };
    }

    function buildElementBinding() {
      return {
        action: "",
        listType: props.listType,
        beforeUpload: beforeUpload,
        httpRequest: customRequest,
        onExceed: () => {
          checkLimit();
          ctx.emit("exceed", { fileList: fileList.value });
        },
        onRemove: (file, fileList) => {
          handleChange(file, fileList);
        },
        onChange: (file, fileList) => {
          handleChange(file, fileList);
        },
        onSuccess: (res, file, fileList) => {
          if (res == null) {
            return;
          }
          file.response = res;
          file.fsRes = res;
          handleSuccess(res, file, fileList);
        },
        // "on-error": "handleUploadFileError",
        // "on-progress": "handleUploadProgress"
        onPreview: handlePreview
      };
    }

    function buildNaiveBinding() {
      return {
        action: "",
        listType: props.listType,
        onBeforeUpload: async ({ file, fileList }) => {
          return beforeUpload(file, fileList);
        },
        customRequest: (context) => {
          const fileInfo = context.file;
          customRequest({
            ...context,
            file: fileInfo.file,
            onSuccess: (res) => {
              //TODO native upload 会清空多余自定义的属性，比如key、md5
              _.merge(fileInfo, res);
              context.onFinish(fileInfo);
            },
            onProgress: (opts) => {
              context.onProgress(opts);
            }
          });
        },
        onExceed: () => {
          checkLimit();
          ctx.emit("exceed", { fileList: fileList.value });
        },
        onRemove: (file) => {
          handleChange(file, fileList.value);
        },
        onChange: ({ event, file, fileList }) => {
          handleChange(file, fileList);
        },
        onFinish: (file) => {
          handleSuccess({}, file, fileList.value);
        },
        onPreview: handlePreview
      };
    }

    const computedBinding = computed(() => {
      let binding: any = null;
      if (ui.type === "antdv") {
        binding = buildAntdvBinding();
      } else if (ui.type === "element") {
        binding = buildElementBinding();
      } else {
        binding = buildNaiveBinding();
      }
      return {
        ...binding,
        ...ctx.attrs
      };
    });

    return {
      fileList,
      fileUploaderRef,
      initValue: initFileList,
      onChange,
      onInput,
      hasUploading,
      isPicture,
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
  .ant-upload-list-item-actions {
    display: flex;
    align-items: center;
    > a {
      display: flex;
      align-items: center;
    }
  }

  .el-upload {
    justify-content: left;
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
    justify-content: center;
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
