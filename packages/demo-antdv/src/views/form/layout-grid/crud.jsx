import * as api from "./api";
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
      form: {
        // 具体可配置请参考 grid 布局： http://www.ruanyifeng.com/blog/2019/03/grid-layout-tutorial.html
        display: "grid",
        wrapper: {
          //grid模式下，labelWidth需要靠样式控制
          customClass: "page-layout"
        }
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
            col: {
              style: { gridColumn: "span 2" } // grid 模式控制跨列
            }
          }
        }
      }
    }
  };
}
