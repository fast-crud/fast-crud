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
        sortable: true,
        type: "number"
      },
      intro: {
        title: "简介",
        sortable: true,
        type: "text-area",
        showOverflowTooltip: true
      },
      content: {
        title: "详情",
        sortable: true,
        type: "editor-ueditor",
        disabled: true,
        form: {
          itemProps: { labelWidth: "0px" }
        }
      }
    },
    form: {
      group: {
        type: "collapse", // tab
        accordion: false,
        groups: {
          base: {
            title: "商品基础",
            icon: "el-icon-goods",
            columns: ["code", "title", "images"]
          },
          price: {
            title: "库存价格",
            icon: "el-icon-price-tag",
            columns: ["store", "price"]
          },
          info: {
            title: "详情",
            collapsed: true,
            icon: "el-icon-warning-outline",
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
  };
}
