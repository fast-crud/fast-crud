import * as api from "./api";
import { AllSuccessValidator } from "@fast-crud/extends-uploader";
export default function ({ expose }) {
  const pageRequest = async (query) => {
    return await api.GetList(query);
  };
  const editRequest = async ({ form, row }) => {
    form.id = row.id;
    return await api.UpdateObj(form);
  };
  const delRequest = async (id) => {
    return await api.DelObj(id);
  };

  const addRequest = async ({ form }) => {
    return await api.AddObj(form);
  };
  return {
    crudOptions: {
      request: {
        pageRequest,
        addRequest,
        editRequest,
        delRequest
      },
      form: {
        wrapper: {
          width: 1000
        }
      },
      columns: {
        id: {
          title: "ID",
          key: "id",
          type: "number",
          column: {
            width: 50
          },
          form: {
            show: false
          }
        },
        file: {
          title: "表单上传",
          type: "file-uploader",
          form: {
            component: {
              uploader: {
                type: "form"
              }
            }
          }
        },
        pictureCard: {
          title: "照片墙",
          type: "image-uploader",
          form: {
            component: {
              limit: 1,
              uploader: {
                type: "form"
              }
            },
            helper: "最大可上传1个文件"
          }
        },
        picture: {
          title: "缩略图",
          type: "image-uploader",
          form: {
            component: {
              listType: "picture",
              uploader: {
                type: "form"
              }
            }
          }
        },
        drag: {
          title: "拖动上传",
          type: "file-uploader",
          form: {
            component: {
              button: {
                text: "将文件拖动到此处，或点击上传"
              },
              drag: true,
              uploader: {
                type: "form"
              }
            }
          }
        },
        cropper: {
          title: "裁剪",
          type: "cropper-uploader",
          form: {
            component: {
              uploader: {
                type: "form"
              }
            }
          }
        },
        limit: {
          title: "限制数量",
          type: "file-uploader",
          form: {
            component: {
              limit: 2,
              uploader: {
                type: "form"
              }
            },
            helper: "最大可上传2个文件"
          }
        },
        sizeLimit: {
          title: "限制大小",
          type: "file-uploader",
          form: {
            component: {
              sizeLimit: 1024,
              uploader: {
                type: "form"
              }
            },
            helper: "大小不能超过1k"
          }
        },
        validation: {
          title: "校验",
          type: "file-uploader",
          form: {
            rules: [
              { required: true, message: "此项必传" },
              {
                //自定义rule之后，要带上这个
                validator: AllSuccessValidator(),
                message: "还有文件正在上传，请稍候"
              }
            ],
            component: {
              uploader: {
                type: "form"
              }
            }
          }
        }
      }
    }
  };
}
