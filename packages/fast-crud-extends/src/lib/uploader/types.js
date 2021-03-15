export default function () {
  return {
    "image-uploader": {
      form: {
        component: {
          name: "fs-el-file-uploader",
          listType: "picture-card",
          accept: ".png,.jpeg,.jpg,.ico,.bmp,.gif",
        },
      },
      column: {
        align: "center",
        component: { name: "fs-images-format", width: "30px" },
      },
      viewForm: {
        component: { height: 100, width: 100 },
      },
    },
    "avatar-uploader": {
      form: {
        component: {
          name: "fs-el-file-uploader",
          limit: 1,
          listType: "avatar",
          accept: ".png,.jpeg,.jpg,.ico,.bmp,.gif",
          showFileList: false,
        },
      },
      column: {
        align: "center",
        component: { name: "fs-images-format", width: "30px" },
      },
      viewForm: {
        component: { height: 100, width: 100 },
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
      },
    },
    "file-uploader": {
      form: {
        component: {
          name: "fs-file-uploader",
          listType: "text",
        },
      },
      column: {
        component: { name: "fs-images-format", width: "30px" },
      },
    },
    "cropper-uploader": {
      form: {
        component: {
          name: "fs-cropper-uploader",
          accept: ".png,.jpeg,.jpg,.ico,.bmp,.gif",
          cropper: { viewMode: 1 },
        },
      },
      column: {
        align: "center",
        component: { name: "fs-images-format", width: "30px" },
      },
      viewForm: {
        component: { height: 100, width: 100 },
      },
    },
  };
}
