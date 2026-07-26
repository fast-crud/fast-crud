import * as api from "./api";
import {
  AddReq,
  CreateCrudOptionsProps,
  CreateCrudOptionsRet,
  DelReq,
  EditReq,
  UserPageQuery,
  UserPageRes,
  dict
} from "@fast-crud/fast-crud";

export default function createCrudOptions({}: CreateCrudOptionsProps): CreateCrudOptionsRet {
  const pageRequest = async (query: UserPageQuery): Promise<UserPageRes> => {
    return await api.GetList(query);
  };

  const addRequest = async ({ form }: AddReq) => {
    return await api.AddObj(form);
  };

  const editRequest = async ({ form, row }: EditReq) => {
    return await api.UpdateObj({ ...form, id: form.id ?? row.id });
  };

  const delRequest = async ({ row }: DelReq) => {
    return await api.DelObj(row.id);
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
          type: "number",
          column: {
            width: 80
          },
          form: {
            show: false
          }
        },
        name: {
          title: "名称",
          type: "text",
          search: {
            show: true
          },
          column: {
            minWidth: 180
          },
          form: {
            rules: [{ required: true, message: "请输入名称" }]
          }
        },
        status: {
          title: "状态",
          type: "dict-select",
          search: {
            show: true
          },
          dict: dict({
            data: [
              { value: 1, label: "启用", color: "success" },
              { value: 0, label: "停用", color: "danger" }
            ]
          })
        }
      }
    }
  };
}
