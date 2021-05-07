import * as api from "./api";
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
      table: { size: "small" },
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
        user: {
          title: "用户信息",
          children: {
            name: {
              title: "姓名",
              type: "text"
            },
            age: {
              title: "年龄",
              type: "number"
            }
          }
        },
        address: {
          title: "地址",
          children: {
            area: {
              title: "地区",
              children: {
                province: {
                  title: "省",
                  search: { show: true },
                  type: "text"
                },
                city: {
                  title: "市",
                  search: { show: true },
                  type: "text"
                },
                county: {
                  title: "区",
                  search: { show: true },
                  type: "text"
                }
              }
            },
            street: {
              title: "街道",
              type: "text"
            }
          }
        }
      }
    }
  };
}
