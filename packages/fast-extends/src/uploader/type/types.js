import { AllUploadSuccessValidator } from "./validators";
import { useI18n } from "@fast-crud/fast-crud";
export default function () {
  const { t } = useI18n();
  return {
    "image-uploader": {
      form: {
        component: {
          name: "fs-file-uploader",
          listType: "picture-card",
          accept: ".png,.jpeg,.jpg,.ico,.bmp,.gif,.webp,.svg"
        },
        rules: [
          {
            validator: AllUploadSuccessValidator(),
            message: t("fs.extends.fileUploader.hasUploading")
          }
        ]
      },
      column: {
        component: { name: "fs-images-format", style: "width:30px" }
      },
      viewForm: {
        component: { height: 100, width: 100 }
      }
    },
    "avatar-uploader": {
      form: {
        rules: [
          {
            validator: AllUploadSuccessValidator(),
            message: t("fs.extends.fileUploader.hasUploading")
          }
        ],
        component: {
          name: "fs-file-uploader",
          limit: 1,
          listType: "picture-card",
          accept: ".png,.jpeg,.jpg,.ico,.bmp,.gif,.webp,.svg",
          showFileList: false
        }
      },
      column: {
        align: "center",
        component: { name: "fs-images-format", style: "width:30px" }
      },
      viewForm: {
        component: { height: 100, width: 100 }
      },
      valueResolve({ row, key }) {
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
        rules: [
          {
            validator: AllUploadSuccessValidator(),
            message: t("fs.extends.fileUploader.hasUploading")
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
          cropper: { viewMode: 1 }
        },
        rules: [
          {
            validator: AllUploadSuccessValidator(),
            message: t("fs.extends.fileUploader.hasUploading")
          }
        ]
      },
      column: {
        align: "center",
        component: { name: "fs-images-format", style: "width:30px" }
      },
      viewForm: {
        component: { height: 100, width: 100 }
      }
    }
  };
}
