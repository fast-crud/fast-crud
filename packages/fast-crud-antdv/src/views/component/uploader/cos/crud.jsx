import * as api from "./api";
import { requestForMock } from "/src/api/service";
import { dict } from "/src/fs";
export default function ({ crudRef }) {
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
    request: {
      pageRequest,
      addRequest,
      editRequest,
      delRequest,
    },
    columns: {
      id: {
        title: "ID",
        key: "id",
        type: "number",
        column: {
          width: 50,
        },
        form: {
          show: false,
        },
      },
      file: {
        title: "腾讯云",
        type: "file-uploader",
        form: {
          component: {
            uploader: {
              type: "cos",
            },
          },
        },
      },
      pictureCard: {
        title: "照片墙",
        type: "image-uploader",
        form: {
          component: {
            uploader: {
              type: "cos",
            },
          },
        },
      },
      cropper: {
        title: "裁剪",
        type: "cropper-uploader",
        form: {
          component: {
            uploader: {
              type: "cos",
            },
          },
        },
      },
    },
  };
}
