import * as api from "./api";
import { requestForMock } from "/src/api/service";
import { dict } from "/src/fs";
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
        tree: {
          title: "树形选择",
          search: { show: true },
          type: "dict-tree",
          dict: dict({
            isTree: true,
            url: "/dicts/cascaderData?single"
          })
        },
        multiple: {
          title: "多选",
          search: { show: true },
          type: "dict-tree",
          dict: dict({
            isTree: true,
            url: "/dicts/cascaderData?single"
          }),
          form: {
            component: {
              "tree-checkable": true
            }
          }
        }
      }
    }
  };
}
