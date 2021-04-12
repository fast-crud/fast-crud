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
  const radioDict = dict({
    url: "/dicts/OpenStatusEnum?single"
  });
  return {
    radioDict,
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
        like: {
          title: "like",
          type: "number",
          search: { show: true }
        },
        createDate: {
          title: "时间",
          type: "datetime",
          column: {
            align: "left",
            width: 300
          },
          valueBuilder({ key, row }) {
            row[key] = dayjs(row[key]);
          }
        },
        updateDate: {
          title: "修改时间",
          type: "datetime",
          column: {
            show: false
          },
          valueBuilder({ key, row }) {
            row[key] = dayjs(row[key]);
          }
        }
      }
    }
  };
}
