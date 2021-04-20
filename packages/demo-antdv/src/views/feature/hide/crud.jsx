import * as api from "./api";
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
      search: {
        show: true
      },
      pagination: {
        show: false
      },
      table: {
        show: true
      },
      actionbar: {
        show: true,
        buttons: {
          add: {
            show: true
          },
          test: {
            text: "自定义按钮",
            show: true,
            click() {
              console.log("click");
            }
          }
        }
      },
      toolbar: {
        show: true,
        buttons: {
          search: { show: true },
          refresh: { show: true },
          compact: { show: true },
          export: { show: true },
          columns: { show: true }
        }
      },
      rowHandle: {
        show: true,
        width: 300,
        buttons: {
          view: { show: true },
          edit: { show: true },
          remove: { show: true },
          custom: {
            text: "自定义",
            order: 4,
            show: true,
            click(context) {
              console.log("click", context);
            }
          }
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
        radio: {
          title: "状态",
          search: { show: true },
          type: "dict-radio",
          dict: dict({
            url: "/dicts/OpenStatusEnum?single"
          })
        }
      }
    }
  };
}
