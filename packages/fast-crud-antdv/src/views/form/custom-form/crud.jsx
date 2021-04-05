import * as api from "./api";
import { dict } from "/src/fs";
export default function({ expose }) {
  const { getFormRef, getFormData } = expose;
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
  return {
    request: {
      pageRequest,
      addRequest,
      editRequest,
      delRequest
    },
    columns: {
      title: {
        title: "商品标题",
        type: "text"
      },
      code: {
        title: "商品代码",
        search: { show: true },
        type: "text"
      }
    }
  };
}
