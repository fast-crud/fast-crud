import * as api from "./api";
export default function({}) {
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
    form: {
      display: "flex"
    },
    columns: {
      name: {
        title: "姓名",
        type: "text",
        search: { show: true }
      },
      order: {
        title: "字段排序",
        type: "text",
        form: {
          order: 0
        }
      },
      intro: {
        title: "跨列",
        type: "text-area",
        form: {
          // flex模式控制跨列
          col: {
            span: 24
          },
          labelCol: { span: 2 },
          wrapperCol: { span: 21 }
        }
      }
    }
  };
}
