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
    prototype: true, //这个dict只是一个原型，引用它的dict组件初始化时都会把此dict对象clone一份
    url: "/dicts/OpenStatusEnum"
  });

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
        remote: {
          title: "远程字典",
          search: { show: true },
          dict: remoteDict,
          type: "dict-select"
        },
        modifyDict: {
          title: "动态修改字典",
          search: {
            show: true,
            component: {
              name: "fs-dict-select",
              options: [
                { value: false, label: "false" },
                { value: true, label: "选我会切换左边字段的字典" }
              ]
            }
          },
          type: "switch",
          form: {
            valueChange({ form, value, getComponentRef }) {
              console.log("form", value);
              const targetDict = getComponentRef("remote")?.getDict();
              if (targetDict) {
                targetDict.url = form.modifyDict ? "/dicts/moreOpenStatusEnum?remote" : "/dicts/OpenStatusEnum?remote";
                targetDict.reloadDict();
              }
            }
          },
          column: {
            component: {
              name: "el-switch"
            },
            valueChange({ value, getComponentRef }) {
              console.log("value", value);
              const targetDict = getComponentRef("remote")?.getDict();
              if (targetDict) {
                targetDict.url = value ? "/dicts/moreOpenStatusEnum?remote" : "/dicts/OpenStatusEnum?remote";
                targetDict.reloadDict();
              }
            }
          }
        }
      }
    }
  };
}
