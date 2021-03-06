import * as api from "./api";
import { requestForMock } from "/@/api/service";
import { useCompute, CrudOptions } from "@fast-crud/fast-crud";
import { ElMessage } from "element-plus";
const { asyncCompute, compute } = useCompute();
export default function ({ expose }): { crudOptions: CrudOptions } {
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
  const crudOptions: CrudOptions = {
    request: {
      pageRequest,
      addRequest,
      editRequest,
      delRequest
    },
    form: {
      labelWidth: "150px"
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
      compute: {
        title: "compute",
        search: { show: false },
        type: "text",
        column: {
          component: {
            name: "el-switch"
          }
        },
        form: {
          component: {
            name: "el-switch"
          },
          helper: "点我触发动态计算"
        }
      },
      shower: {
        title: "根据compute显示",
        search: { show: false },
        type: "text",
        form: {
          component: {
            show: compute(({ form }) => {
              return form.compute;
            })
          }
        }
      },
      remote: {
        title: "asyncCompute",
        search: { show: true },
        type: "text",
        form: {
          component: {
            name: "fs-dict-select",
            placeholder: "异步计算远程获取options",
            options: asyncCompute({
              async asyncFn(watchValue, context) {
                const url = "/dicts/OpenStatusEnum?remote";
                return await requestForMock({ url });
              }
            })
          },
          helper: "我的options是异步计算远程获取的"
        }
      },
      remote2: {
        title: "监听switch触发异步计算",
        search: { show: false },
        type: "text",
        form: {
          component: {
            name: "fs-dict-select",
            placeholder: "异步计算远程获取options",
            options: asyncCompute({
              watch({ form }) {
                return form.compute;
              },
              async asyncFn(watchValue) {
                ElMessage.info("监听switch,触发远程获取options");
                const url = watchValue ? "/dicts/OpenStatusEnum?remote" : "/dicts/moreOpenStatusEnum?remote";
                return await requestForMock({ url });
              }
            })
          },
          helper: "监听其他属性修改后，触发重新计算"
        }
      }
    }
  };
  return {
    crudOptions
  };
}
