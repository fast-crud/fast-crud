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
        product: {
          title: "未分组字段",
          type: "text",
          form: {
            col: { span: 24 },
            helper: "未分组的字段会显示在这里，一般来说你应该把所有字段都编入分组内"
          }
        },
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
            "show-overflow-tooltip": true
          }
        },
        content: {
          title: "详情",
          type: "editor-ueditor",
          form: {
            itemProps: { labelWidth: "0px" }
          }
        }
      },
      form: {
        labelWidth: "90px",
        group: {
          type: "collapse", // tab
          accordion: true, //手风琴模式
          groups: {
            base: {
              slots: {
                //自定义header
                title: () => {
                  return (
                    <span style={"color:green;"}>
                      商品基础
                      <fs-icon icon={"el-icon-check"} style={"margin-left:10px;"} />
                    </span>
                  );
                }
              },
              columns: ["code", "title", "images"]
            },
            price: {
              title: "库存价格",
              columns: ["store", "price"]
            },
            info: {
              title: "详情",
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
