import * as api from "./api";
export default function ({ crudRef }) {
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
  return {
    request: {
      pageRequest,
      addRequest,
      editRequest,
      delRequest,
    },
    columns: {
      name: {
        title: "姓名",
        type: "text",
        search: { show: true },
      },
      zip: {
        title: "邮编",
        type: "text",
      },
      intro: {
        title: "简介",
        type: "text-area",
      },
    },
  };
}
