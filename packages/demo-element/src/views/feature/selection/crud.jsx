import * as api from "./api";
import { dict } from "@fast-crud/fast-crud";
import { ref } from "vue";
import { compute } from "../../../../../fast-crud/src";
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

  const selectedIds = ref([]);

  const onSelectionChange = (changed) => {
    console.log("selection", changed);
    selectedIds.value = changed.map((item) => item.id);
  };
  return {
    selectedIds,
    crudOptions: {
      request: {
        pageRequest,
        addRequest,
        editRequest,
        delRequest
      },
      table: {
        onSelectionChange
      },
      columns: {
        _checked: {
          title: "选择",
          form: { show: false },
          column: {
            type: "selection",
            align: "center",
            width: "55px",
            disabledColumnsFilter: true //禁止在列设置中选择
          }
        },
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
