import * as api from "./api";
import { requestForMock } from "/src/api/service";
import { dict } from "/src/fs";
import { useCompute } from "@fast-crud/fast-crud";
import { a } from "../../../../dist/assets/vendor.3a530989";
const { asyncCompute, compute } = useCompute();
export default function({ crudRef }) {
  const pageRequest = async query => {
    return await api.GetList(query);
  };
  const editRequest = async ({ form, row }) => {
    form.id = row.id;
    return await api.UpdateObj(form);
  };
  const delRequest = async id => {
    return await api.DelObj(id);
  };

  const addRequest = async ({ form }) => {
    return await api.AddObj(form);
  };
  const statusDict = dict({
    data: [
      { value: "1", label: "开启", color: "success" },
      { value: "2", label: "停止", color: "blue" },
      { value: "0", label: "关闭", color: "blue" }
    ]
  });

  const remoteDict = dict({
    url: "/dicts/OpenStatusEnum?remote"
  });
  return {
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
      status: {
        title: "本地字典",
        search: { show: false },
        form: {
          component: {
            name: "a-select",
            vModel: "value",
            options: compute(() => {
              console.log("statusdict.data", statusDict);
              return statusDict.data;
            })
          }
        },
        column: {
          component: {
            name: "fs-values-format",
            dict: statusDict
          }
        }
      },
      remote: {
        title: "远程字典",
        search: { show: true },
        form: {
          component: {
            name: "a-select",
            vModel: "value",
            placeholder: "请选择",
            options: asyncCompute({
              asyncFunc: async () => {
                await statusDict.loadDict();
                return statusDict.data;
              }
            })
          }
        },
        column: {
          component: {
            name: "fs-values-format",
            dict: statusDict
          }
        }
      }
    }
  };
}
