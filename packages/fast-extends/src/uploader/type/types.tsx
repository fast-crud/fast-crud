import { AllUploadSuccessValidator } from "./validators";
import { uiContext, useI18n, ValueResolveContext } from "@fast-crud/fast-crud";
export default function () {
  const { t } = useI18n();
  const ui = uiContext.get();
  return {
    "image-uploader": {
      form: {
        component: {
          name: "fs-file-uploader",
          listType: ui.upload.typeImageCard,
          accept: ".png,.jpeg,.jpg,.ico,.bmp,.gif,.webp,.svg"
        },
        [ui.formItem.rules]: [
          {
            validator: AllUploadSuccessValidator(),
            message: t("fs.extends.fileUploader.hasUploading"),
            trigger: "blur"
          }
        ]
      },
      column: {
        component: {
          name: "fs-images-format",
          style: "width:30px",
          previewTeleported: true,
          // @ts-ignore
          previewMask: () => <div class={`ant-mask-info`}>{<fs-icon icon={ui.icons.eye} />}</div>
        }
      },
      viewForm: {
        component: { height: 100, width: 100 }
      }
    },
    "avatar-uploader": {
      form: {
        [ui.formItem.rules]: [
          {
            validator: AllUploadSuccessValidator(),
            message: t("fs.extends.fileUploader.hasUploading"),
            trigger: "blur"
          }
        ],
        component: {
          name: "fs-file-uploader",
          limit: 1,
          listType: ui.upload.typeImageCard,
          accept: ".png,.jpeg,.jpg,.ico,.bmp,.gif,.webp,.svg"
        }
      },
      column: {
        align: "center",
        component: { name: "fs-images-format", style: "width:30px", previewTeleported: true }
      },
      viewForm: {
        component: { height: 100, width: 100 }
      },
      valueResolve({ row, key }: ValueResolveContext) {
        const value = row[key];
        if (value != null && value instanceof Array) {
          if (value.length >= 0) {
            row[key] = value[0].url;
          } else {
            row[key] = null;
          }
        }
      }
    },
    "file-uploader": {
      form: {
        component: {
          name: "fs-file-uploader",
          listType: "text"
        },
        [ui.formItem.rules]: [
          {
            validator: AllUploadSuccessValidator(),
            message: t("fs.extends.fileUploader.hasUploading"),
            trigger: "blur"
          }
        ]
      },
      column: {
        component: { name: "fs-files-format" }
      }
    },
    "cropper-uploader": {
      form: {
        component: {
          name: "fs-cropper-uploader",
          accept: ".png,.jpeg,.jpg,.ico,.bmp,.gif,.svg,.webp",
          cropper: { aspectRatio: 1, autoCropArea: 1, viewMode: 0 }
        },
        [ui.formItem.rules]: [
          {
            validator: AllUploadSuccessValidator(),
            message: t("fs.extends.fileUploader.hasUploading"),
            trigger: "blur"
          }
        ]
      },
      column: {
        align: "center",
        component: { name: "fs-images-format", style: "width:30px", previewTeleported: true }
      },
      viewForm: {
        component: { height: 100, width: 100 }
      }
    }
  };
}
