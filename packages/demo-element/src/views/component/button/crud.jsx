import * as api from "./api";
import { compute } from "@fast-crud/fast-crud";
import { ElMessage } from "element-plus";
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
        //配置表单label的宽度
        labelCol: { span: 6 }
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
        button: {
          title: "按钮",
          type: "button",
          column: {
            component: {
              show: compute(({ value }) => {
                //当value为null时，不显示
                return value != null;
              }),
              on: {
                onClick({ row }) {
                  ElMessage.success("按钮点击:" + row.button);
                }
              }
            }
          }
        },
        url: {
          title: "url",
          search: { show: true },
          type: "text",
          column: {
            show: false
          }
        },
        link: {
          title: "链接按钮",
          type: "link",
          column: {
            component: {
              show: compute(({ value }) => {
                return value != null;
              }),
              on: {
                onClick({ row }) {
                  if (row.url) {
                    window.open(row.url);
                  }
                }
              }
            }
          },
          form: {
            title: "按钮文字"
          }
        },
        link2: {
          title: "手写link配置", //下面的配置相当于上面的type:link
          type: "text", //form组件用input
          column: {
            component: {
              show: compute(({ value }) => {
                return value != null;
              }),
              name: "fs-button", //列展示组件为button
              vModel: "text", // 将row.link2的值赋值给text属性
              type: "text", // 按钮展示为链接样式
              on: {
                //注册点击事件
                onClick({ row }) {
                  if (row.url) {
                    window.open(row.url);
                  }
                }
              }
            }
          }
        }
      }
    }
  };
}
