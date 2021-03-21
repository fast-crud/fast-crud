import * as api from "./api";
import { requestForMock } from "/src/api/service";
import { dict } from "/src/fs";
import { useCompute } from "@fast-crud/fast-crud";
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
    url: "/dicts/OpenStatusEnum"
  });
  //设置为不可clone，将会复制引用，从而可以控制dictData 影响全部的实例
  remoteDict.unCloneable();
  remoteDict.loadDict();
  return {
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
      status: {
        title: "本地字典",
        search: { show: false },
        dict: statusDict,
        type: "dict-select"
      },
      remote: {
        title: "远程字典",
        search: { show: true },
        dict: remoteDict,
        type: "dict-select",
        column: {
          component: {
            on: {
              onClick(event) {
                console.log("clicked", event);
                console.log(
                  "clicked",
                  event.column.component.dict,
                  event.column.component.dict === remoteDict
                );
              }
            }
          }
        }
      },
      modifyDict: {
        title: "动态修改字典",
        search: { show: false },
        type: "text",
        form: {
          component: {
            name: "a-switch",
            vModel: "checked",
            on: {
              onChange({ form }) {
                console.log("changed", form.modifyDict);
                remoteDict.url = form.modifyDict
                  ? "/dicts/OpenStatusEnum?remote"
                  : "/dicts/moreOpenStatusEnum?remote";
                remoteDict.reloadDict();
              }
            }
          }
        },
        column: {
          component: {
            name: "a-switch",
            vModel: "checked",
            on: {
              onChange({ row }) {
                remoteDict.url = row.modifyDict
                  ? "/dicts/OpenStatusEnum?remote"
                  : "/dicts/moreOpenStatusEnum?remote";
                remoteDict.reloadDict();
              }
            }
          }
        }
      }
    }
  };
}
