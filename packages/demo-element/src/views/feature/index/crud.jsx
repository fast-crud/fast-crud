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
      table: {},
      columns: {
        index: {
          title: "序号",
          form: { show: false },
          column: {
            type: "index",
            align: "center",
            width: "55px",
            columnSetDisabled: true, //禁止在列设置中选择
            index: (index) => {
              // 自定义序号索引,全局计算序号，见el-table文档
              // 不传本方法则默认每页序号从1开始
              let pagination = expose.crudBinding.value.pagination;
              return ((pagination.currentPage ?? 1) - 1) * pagination.pageSize + index + 1;
            }
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
