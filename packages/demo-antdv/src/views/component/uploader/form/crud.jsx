import * as api from "./api";
import { AllSuccessValidator } from "@fast-crud/extends-uploader";
import { dict } from "@fast-crud/fast-crud";
export default function ({ expose }) {
  const pageRequest = async (query) => {
    return await api.GetList(query);
  };
  const editRequest = async ({ form, row }) => {
    form.id = row.id;
    return await api.UpdateObj(form);
  };
  const delRequest = async ({ row }) => {
    return await api.DelObj(row.id);
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
        // pictureCard: {
        //   title: "照片墙",
        //   type: "image-uploader",
        //   form: {
        //     component: {
        //       limit: 1,
        //       uploader: {
        //         type: "form"
        //       }
        //     },
        //     helper: "最大可上传1个文件"
        //   }
        // },
        // cropper: {
        //   title: "裁剪",
        //   type: "cropper-uploader",
        //   form: {
        //     component: {
        //       uploader: {
        //         type: "form"
        //       }
        //     }
        //   }
        // },
        // limit: {
        //   title: "限制数量",
        //   type: "file-uploader",
        //   form: {
        //     component: {
        //       limit: 2,
        //       uploader: {
        //         type: "form"
        //       }
        //     },
        //     helper: "最大可上传2个文件"
        //   }
        // },
        // sizeLimit: {
        //   title: "限制大小",
        //   type: "file-uploader",
        //   form: {
        //     component: {
        //       sizeLimit: 1024,
        //       uploader: {
        //         type: "form"
        //       }
        //     },
        //     helper: "大小不能超过1k"
        //   }
        // },
        // validation: {
        //   title: "校验",
        //   type: "file-uploader",
        //   form: {
        //     rules: [
        //       { required: true, message: "此项必传" },
        //       {
        //         validator: AllSuccessValidator(),
        //         message: "还有文件正在上传，请稍候"
        //       }
        //     ],
        //     component: {
        //       uploader: {
        //         type: "form"
        //       }
        //     }
        //   }
        // },
        statusRemote: {
          title: "单选",
          search: {
            show: true,
            rules: null,
            component: {
              style: { width: "100px" }
            }
          },
          type: "dict-select",
          dict: dict({
            url: "/dicts/OpenStatusEnum?simple"
          }),
          form: {
            helper: "测试单选与图片组件同时存在时没有下拉框的bug",
            rules: [{ required: true, message: "请选择一个选项" }]
          }
        }
      }
    }
  };
}
