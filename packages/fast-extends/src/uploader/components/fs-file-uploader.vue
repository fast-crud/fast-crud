<template>
  <div class="fs-file-uploader" :class="{ 'fs-file-uploader-limit': computedOnLimit() }">
    <component :is="ui.upload.name" ref="fileUploaderRef" v-model:file-list="fileList" v-bind="computedBinding">
      <component :is="computedFileSelectBtn.is" v-bind="computedFileSelectBtn" />
    </component>
    <component
      :is="ui.dialog.name"
      v-if="isPicture()"
      v-model:[ui.dialog.visible]="previewVisible"
      v-bind="computedPreview"
    >
      <img style="max-width: 100%; max-height: 100%" :src="previewImage" />
    </component>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, nextTick, Ref, ref, watch } from "vue";
import { useI18n, useUi } from "@fast-crud/fast-crud";
import { merge, cloneDeep } from "lodash-es";
import { FileItem, FsUploaderDoUploadOptions } from "../d/type";
import { useUploader } from "./utils";
import type { PropType } from "vue";

/**
 * 限制上传图片的像素尺寸
 */
type PixelLimit = { width?: number; height?: number; tip?: string } | [number, number?, string?];
/**
 * 文件上传组件
 * 支持对应ui库的[x]-file-uploader组件的配置
 */
export default defineComponent({
  name: "FsFileUploader",
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
     * 可以直接传一个数字，也可以传 `{limit:number,tip:'自定义提示文本'}`
     */
    sizeLimit: {
      type: [Number, Object]
    },
    /**
     * 限制上传图片的像素尺寸
     * 可以传数组会对象{ width?: number, height?: number, tip?: string } | [number, number?, string?]
     */
    pixelLimit: {
      type: Object as PropType<PixelLimit>,
      required: false
    },
    /**
     * 是否显示限制提示
     */
    showLimitTip: {
      type: Boolean,
      default: true
    },
    /**
     * 构建url的方法
     * 后台返回key之后，将其build成一个可访问的url，用于反显
     * 如果successHandle返回的object中已包含url，此配置将不会执行
     */
    buildUrl: {
      default() {
        return (value: any) => {
          return value;
        };
      }
    },
    /**
     * 多个value值构建多个url
     * 如果successHandle 返回的object中已包含url，此方法将不会执行
     */
    buildUrls: {},
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
     * 上传请求前的操作，可以压缩图片等，替换掉context中的file
     * type: `async (context)=>void`
     */
    beforeUploadRequest: {
      type: Function
    },
    /**
     * FsUploaderXXX的配置
     * 可以覆盖全局配置里各个上传类型对应的配置
     * 例如: `{action:'xxx',bucket:'xxx',...}`
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
     * 上传成功后从结果中取值类型
     * 支持：`[object,url,key,其他（successHandle返回的object内要有该字段，不要用'id'）]`
     * 如果配置了非url，则需要配置buildUrl用于反显
     */
    valueType: {
      type: String, // url ,key, object
      default: "url"
    },
    /**
     * 根据value获取文件名，用于显示在fileList里面
     */
    getFileName: {}
  },
  emits: ["change", "update:modelValue", "success", "exceed", "remove"],
  setup(props: any, ctx: any) {
    const { ui } = useUi();
    const { t } = useI18n();
    // uploader 的 modelValue
    const fileList: Ref = ref([]);
    const currentValue: Ref = ref();
    const fileUploaderRef: Ref = ref();

    const pickFileName = computed(() => {
      return (
        props.getFileName ||
        (async (url: string) => {
          if (typeof url !== "string") {
            console.warn("获取文件名失败，请配置getFileName");
            return url;
          }
          const suffix = url.substring(url.lastIndexOf("/") + 1);
          const wenIndex = suffix.indexOf("?");
          if (wenIndex >= 0) {
            return suffix.substring(0, wenIndex);
          }
          return suffix;
        })
      );
    });

    function getValueByValueType(item: any) {
      if (props.valueType === "object") {
        return item;
      }
      return item[props.valueType];
    }

    function getValueByValueTypeFromList(list: any[]) {
      const values = [];
      for (let item of list) {
        values.push(getValueByValueType(item));
      }
      return values;
    }

    async function buildListToFile(list: any[]) {
      const arr = [];
      for (let value of list) {
        let fileValue: any;
        if (
          typeof value === "string" ||
          typeof value === "number" ||
          typeof value === "boolean" ||
          value instanceof Date
        ) {
          fileValue = {
            url: undefined,
            key: value,
            value
          };
          if (props.valueType !== "object") {
            fileValue[props.valueType] = value;
          }
        } else {
          fileValue = value;
        }
        if (!fileValue[ui.upload.id]) {
          fileValue[ui.upload.id] = Math.random() + "";
        }
        if (!fileValue.status) {
          fileValue.status = ui.upload.status.success;
        }
        arr.push(fileValue);
      }
      await buildFileItemUrls(arr);
      for (const item of arr) {
        if (!item.name) {
          const url = item.url || item.value;
          item.name = await pickFileName.value(url, item);
        }
      }
      return arr;
    }

    async function buildListToValue(list: any[]) {
      const arr: any = [];
      for (let file of list) {
        const res = file.response || file.fsRes;
        const value: FileItem = {
          size: file.size,
          name: file.name,
          uid: file.uid,
          ...(res != null ? res : file)
        };
        arr.push(value);
      }
      await buildFileItemUrls(arr);
      return getValueByValueTypeFromList(arr);
    }

    async function initFileList(value: any) {
      const array: any = [];
      if (value == null || value.length === 0) {
        fileList.value = array;
        return;
      }
      if (value instanceof Array) {
        for (let item of value) {
          array.push(item);
        }
      } else {
        array.push(value);
      }

      const list = await buildListToFile(array);
      updateFileList(list);
    }

    async function onFormValueChanged() {
      await formValidator.onChange();
      await formValidator.onBlur();
    }

    async function emitValue(list: FileItem[]) {
      let value = await buildEmitValue(list);
      onInput(value);
      nextTick(async () => {
        await onFormValueChanged();
      });
    }

    async function buildEmitValue(fList: FileItem[]) {
      if (fList == null || fList.length === 0) {
        return props.limit === 1 ? null : [];
      }

      if (props.limit === 1) {
        const list: any = await buildListToValue(fList);
        return list[0];
      }
      const array: any = [];
      for (let item of fList) {
        if (ui.upload.isSuccess(item)) {
          array.push(item);
        }
      }
      return await buildListToValue(array);
    }

    async function buildFileItemUrls(list: any[]) {
      let needUrlItems = list.filter((item) => {
        return item.url == null;
      });
      if (props.buildUrls) {
        const values = needUrlItems.map((item) => {
          return getValueByValueType(item);
        });
        const urls = await props.buildUrls(values);
        for (let i = 0; i < needUrlItems.length; i++) {
          needUrlItems[i].url = urls[i];
        }
      } else if (props.buildUrl) {
        for (let needUrlItem of needUrlItems) {
          needUrlItem.url = await props.buildUrl(getValueByValueType(needUrlItem));
        }
      } else {
        for (let needUrlItem of needUrlItems) {
          needUrlItem.url = needUrlItem.value || needUrlItem.key;
        }
      }
    }

    function onChange(value: any) {
      ctx.emit("change", value);
    }

    function onInput(value: any) {
      currentValue.value = value;
      ctx.emit("update:modelValue", value);
    }

    const formValidator = ui.formItem.injectFormItemContext();
    watch(
      () => {
        return props.modelValue;
      },
      async (value) => {
        onChange(value);
        if (value === currentValue.value) {
          return;
        }
        await initFileList(value);
      }
    );
    //@ts-ignore
    // eslint-disable-next-line vue/no-setup-props-destructure
    initFileList(props.modelValue);

    function hasUploading() {
      const uploading = fileList.value.filter((item: any) => {
        return item.status === ui.upload.status.uploading;
      });
      return uploading.length > 0;
    }

    function handleChange(file: any, list: any) {
      updateFileList(list);
      emitValue(list);
    }

    function handleSuccess(res: any, file: any, list: any) {
      ctx.emit("success", { res, file, fileList: list });
      handleChange(file, list);
    }

    function formatFileSize(fileSize: number) {
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
      if (props.showLimitTip) {
        ui.message.warn(t("fs.extends.fileUploader.limitTip", [props.limit]));
      }
    }

    function checkLimit() {
      if (computedOnLimit(true)) {
        showLimitTip();
        ctx.emit("exceed", { fileList: fileList.value, limit: props.limit });
        throw new Error("文件数量超限");
      }
    }

    function checkSizeLimit(file: any) {
      if (props.sizeLimit != null) {
        let limit = props.sizeLimit;
        let showMessage: any = null;
        if (typeof props.sizeLimit === "number") {
          showMessage = (fileSize: number, limit: number) => {
            const limitTip = formatFileSize(limit);
            const fileSizeTip = formatFileSize(file.size);
            ui.message.warn(t("fs.extends.fileUploader.sizeLimitTip", [limitTip, fileSizeTip]));
          };
        } else {
          limit = props.sizeLimit.limit;
          showMessage = props.sizeLimit.tip;
        }
        if (file.size > limit) {
          let message = "文件大小超过限制，当前文件大小：" + file.size / 1024 + "k";
          showMessage(file.size, limit);
          throw new Error(message);
        }
      }
    }

    /**
     * 图片上传前判断图片像素尺寸是否符合
     * @param file
     */
    const checkPixelLimit = (file: File): Promise<boolean> => {
      let imageMaxWidth = 0;
      let imageMaxHeight = 0;
      let tip = "";
      if (!props.pixelLimit) {
        return Promise.resolve(true);
      } else if (Array.isArray(props.pixelLimit)) {
        imageMaxWidth = props.pixelLimit[0];
        imageMaxHeight = props.pixelLimit[1] || props.pixelLimit[0] || 0;
        tip = props.pixelLimit[2] || "";
      } else if (typeof props.pixelLimit == "object") {
        imageMaxWidth = props.pixelLimit.width || 0;
        imageMaxHeight = props.pixelLimit.height || 0;
        tip = props.pixelLimit.tip || "";
      }
      let errMsg = tip || t("fs.extends.fileUploader.pixelLimitTip", [imageMaxWidth, imageMaxHeight]);
      return new Promise((resolve, reject) => {
        let reader = new FileReader();
        reader.onload = (e) => {
          let src = e.target?.result;
          let image = new Image();
          image.onload = function () {
            if (imageMaxWidth && image.width > imageMaxWidth) {
              ui.message.warn(errMsg);
              reject(errMsg);
            } else if (imageMaxHeight && image.height > imageMaxHeight) {
              ui.message.warn(errMsg);
              reject(errMsg);
            } else {
              resolve(true);
            }
          };
          image.onerror = function (e) {
            ui.message.warn(t("fs.extends.fileUploader.loadError"));
            reject(t("fs.extends.fileUploader.loadError"));
          };
          if (src) {
            image.src = src as string;
          }
        };
        reader.readAsDataURL(file);
      });
    };
    const beforeUpload = async (file: any, list = fileList.value) => {
      if (props.beforeUpload) {
        const ret = await props.beforeUpload({ file, fileList: fileList.value });
        if (ret === false) {
          return false;
        }
      }
      try {
        checkLimit();
        checkSizeLimit(file);
        if (isPicture()) {
          await checkPixelLimit(file);
        }
      } catch (e) {
        return false;
      }
    };

    function updateFileList(list: any) {
      fileList.value = list;
    }

    async function doUpload(option: FsUploaderDoUploadOptions) {
      option.options = props.uploader || {};
      const { getUploaderImpl } = useUploader();
      let uploaderRef = await getUploaderImpl(option.options.type);
      if (uploaderRef == null) {
        ui.message.warn("Sorry，The uploader component is not ready yet");
        throw new Error("Sorry，The component is not ready yet");
      }
      return await uploaderRef?.upload(option);
    }

    async function customRequest(context: any) {
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

    const previewVisible: Ref = ref(false);
    const previewImage: Ref = ref();
    const computedPreview = computed(() => {
      return {
        ...ui.dialog.footer(),
        ...props.preview
      };
    });

    function getBase64(file: File) {
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

    const handlePreview = async (file: any) => {
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
      const res: any = {
        customRequest,
        beforeUpload,
        limit: props.limit,
        listType: props.listType,
        onChange: (change: any) => {
          const { file, fileList } = change;
          handleChange(file, fileList);
          if (file.status === "done") {
            handleSuccess(file.response, file, fileList);
          }
        },
        onPreview: handlePreview
      };

      if (props.limit != null && ctx.attrs.maxCount == null) {
        res.maxCount = props.limit;
      }
      return res;
    }

    function buildElementBinding() {
      return {
        action: "",
        listType: props.listType,
        limit: props.limit,
        beforeUpload: beforeUpload,
        httpRequest: customRequest,
        onExceed: (event) => {
          ctx.emit("exceed", event, fileList);
        },
        onRemove: (file: any, fileList: any) => {
          handleChange(file, fileList);
          ctx.emit("remove", file, fileList);
        },
        onChange: (file: any, fileList: any) => {
          handleChange(file, fileList);
        },
        onSuccess: (res: any, file: any, fileList: any) => {
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

    const naiveExtraCache: any = {};

    function buildNaiveBinding() {
      function appendExtra(fileList: any) {
        let list = fileList.value || fileList;
        list = cloneDeep(list);
        for (let item of list) {
          const extra = naiveExtraCache[item.id];
          if (extra) {
            merge(item, extra);
          }
        }
        return list;
      }

      return {
        action: "",
        limit: props.limit,
        listType: props.listType,
        onBeforeUpload: async ({ file, fileList }: any) => {
          return beforeUpload(file, fileList);
        },
        customRequest: (context: any) => {
          const fileInfo = context.file;
          customRequest({
            ...context,
            file: fileInfo.file,
            onSuccess: async (res: any) => {
              //TODO native upload 会清空多余自定义的属性，比如key、md5
              const value = props.valueType === "object" ? res : res[props.valueType];
              res.url = await props.buildUrl(value);
              merge(fileInfo, res);
              naiveExtraCache[fileInfo.id] = {
                ...res,
                fsRes: res
              };
              context.onFinish(fileInfo);
            },
            onProgress: (opts: any) => {
              context.onProgress(opts);
            }
          });
        },
        onExceed: (event) => {
          ctx.emit("exceed", event);
        },
        onRemove: (opts: any) => {
          const { file, fileList } = opts;
          // handleChange(file, [...fileList]);
          ctx.emit("remove", opts);
        },
        onChange: (opts: any) => {
          const { event, file, fileList } = opts;
          const list = appendExtra(fileList);
          handleChange(file, [...list]);
        },
        onFinish: (file: any) => {
          const extra = naiveExtraCache[file.id];
          if (extra) {
            merge(file, extra);
          }
          const list = appendExtra(fileList);
          handleSuccess(extra, file, list);
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
      ui,
      fileList,
      fileUploaderRef,
      initValue: initFileList,
      onChange,
      onInput,
      hasUploading,
      isPicture,
      computedFileSelectBtn,
      previewVisible,
      previewImage,
      computedPreview,
      computedOnLimit,
      computedBinding,
      emitValue
    };
  }
});
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
    justify-content: center;
    align-items: center;

    > a {
      display: flex;
      align-items: center;
      justify-content: center;
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
