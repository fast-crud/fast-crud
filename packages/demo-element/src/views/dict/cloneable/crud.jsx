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

  const remoteDict = dict({
    cloneable: true,
    url: "/dicts/OpenStatusEnum"
  });

  return {
    crudOptions: {
      remoteDict,
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
        remote: {
          title: "远程字典",
          search: { show: true },
          dict: remoteDict,
          type: "dict-select"
        },
        modifyDict: {
          title: "动态修改字典",
          search: { show: false },
          type: "switch",
          column: {
            component: {
              name: "el-switch"
            },
            valueChange({ row, getComponentRef }) {
              console.log("cell valueChanged", row);
              // 这里不能使用remoteDict,因为在分发时已经clone到form配置中了
              // 这里dict修改不会影响列里面的数据
              const targetDict = getComponentRef("remote")?.dict;
              if (targetDict) {
                targetDict.url = row.modifyDict ? "/dicts/moreOpenStatusEnum?remote" : "/dicts/OpenStatusEnum?remote";
                targetDict.reloadDict();
              }
            }
          },
          form: {
            valueChange({ form, getComponentRef }) {
              console.log("form valueChanged", form);
              // 这里不能使用remoteDict,因为在分发时已经clone到form配置中了
              // 这里dict修改不会影响列里面的数据
              const targetDict = getComponentRef("remote")?.dict;
              if (targetDict) {
                targetDict.url = form.modifyDict ? "/dicts/moreOpenStatusEnum?remote" : "/dicts/OpenStatusEnum?remote";
                targetDict.reloadDict();
              }
            }
          }
        }
      }
    }
  };
}
