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

  const remoteDict = dict({
    cloneable: true,
    url: "/dicts/OpenStatusEnum",
  });

  return {
    crudOptions: {
      remoteDict,
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
        remote: {
          title: "远程字典",
          search: { show: true },
          dict: remoteDict,
          type: "dict-select",
          form: {
            component: { dict: { cache: false } },
          },
        },
        modifyDict: {
          title: "动态修改字典",
          search: { show: false },
          type: "text",
          column: {
            component: {
              name: "a-switch",
              vModel: "checked",
            },
            valueChange({ row, getComponentRef }) {
              // 这里不能使用remoteDict,因为在分发时已经clone到form配置中了
              // 这里dict修改不会影响列里面的数据
              const targetDict = getComponentRef("remote").dict;
              targetDict.url = row.modifyDict
                ? "/dicts/moreOpenStatusEnum?remote"
                : "/dicts/OpenStatusEnum?remote";
              targetDict.reloadDict();
            },
          },
          form: {
            component: {
              name: "a-switch",
              vModel: "checked",
            },
            valueChange({ form, getComponentRef }) {
              // 这里不能使用remoteDict,因为在分发时已经clone到form配置中了
              // 这里dict修改不会影响列里面的数据
              const targetDict = getComponentRef("remote").dict;
              targetDict.url = form.modifyDict
                ? "/dicts/moreOpenStatusEnum?remote"
                : "/dicts/OpenStatusEnum?remote";
              targetDict.reloadDict();
            },
          },
        },
      },
    },
  };
}
