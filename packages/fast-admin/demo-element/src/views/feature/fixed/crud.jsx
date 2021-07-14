import * as api from "./api";
import { dict } from "@fast-crud/fast-crud";
export default function ({ expose }) {
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
        pageRequest: api.GetList,
        addRequest,
        editRequest,
        delRequest
      },
      rowHandle: {
        fixed: "right"
      },
      columns: {
        text1: {
          title: "text1",
          type: "text",
          column: {
            fixed: "left",
            width: 260
          }
        },
        id: {
          title: "id",
          type: "text",
          column: {
            width: 100
          }
        },
        text2: {
          title: "text2",
          type: "text",
          column: {
            width: 260
          }
        },
        text3: {
          title: "text3",
          type: "text",
          column: {
            width: 260
          }
        },
        text4: {
          title: "text4",
          type: "text",
          column: {
            width: 260
          }
        },
        text5: {
          title: "text5",
          type: "text",
          column: {
            width: 260
          }
        },
        last: {
          title: "last",
          type: "text",
          column: {
            width: 260
          }
        }
      }
    }
  };
}
