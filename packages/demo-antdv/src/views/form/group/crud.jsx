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
      columns: {
        title: {
          title: "商品标题",
          type: "text"
        },
        code: {
          title: "商品代码",
          search: { show: true },
          type: "text"
        },
        images: {
          title: "图片",
          type: "image-uploader"
        },
        price: {
          title: "价格",
          sortable: true
        },
        store: {
          title: "库存",
          type: "number"
        },
        intro: {
          title: "简介",
          type: "text-area",
          column: {
            ellipsis: true
          }
        },
        content: {
          title: "详情",
          type: "editor-ueditor",
          form: {
            itemProps: { labelWidth: "0px" }
          }
        },
        product: {
          title: "未分组字段",
          type: "text",
          form: {
            col: { span: 24 },
            helper: "未分组的字段会显示在这里，一般来说你应该把所有字段都编入分组内"
          }
        }
      },
      form: {
        group: {
          type: "collapse", // tab
          accordion: true, //手风琴模式
          groups: {
            base: {
              slots: {
                //自定义header
                header: () => {
                  return (
                    <span style={"color:green"}>
                      商品基础
                      <CheckOutlined style={"margin-left:10px;"} />
                    </span>
                  );
                }
              },
              columns: ["code", "title", "images"]
            },
            price: {
              header: "库存价格",
              columns: ["store", "price"]
            },
            info: {
              header: "详情",
              collapsed: true, //默认折叠
              columns: ["intro", "content"]
            }
            // custom: {
            //   title: "自定义",
            //   collapsed: false,
            //   show(context) {
            //     console.log("custom context", context);
            //     return context.mode === "view";
            //   },
            //   disabled: false,
            //   icon: "el-icon-warning-outline",
            //   columns: ["custom", "custom2"]
            // }
          }
        }
      }
    }
  };
}
