import { compute, dict } from "@fast-crud/fast-crud/src";
import * as api from "./api";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
    table: {
      show: true,
      size: "small",
      pagination: false,
    },
    options: {},
    request: {
      pageRequest,
      addRequest,
      editRequest,
      delRequest,
      transformQuery: ({ page, form }) => {
        return { current: page.currentPage, size: page.pageSize, ...form };
      },
      transformRes: ({ res }) => {
        return { currentPage: res.current, pageSize: res.size, ...res };
      },
    },
    actionbar: {
      buttons: {
        add: {
          type: "primary",
        },
      },
      show: true,
    },
    form: {
      display: "flex",
      labelCol: { span: 4 },
      wrapperCol: { span: 18 }, // antdv
    },
    addForm: {
      wrapper: {
        is: "a-drawer",
      },
    },
    columns: {
      date: {
        title: "日期",
        column: {
          sortable: true,
        },
      },
      name: {
        title: "姓名",
        type: "text",
        search: { show: true },
        column: {
          component: {
            name: "a-button",
            children: {
              default: (scope) => {
                return <div>{scope.row.name}</div>;
              },
            },
            style: "width:100px",
            events: {
              onClick: (context) => {
                console.log("clicked", context);
                context.row.name =
                  context.row.name === "李四" ? "王小虎" : "李四";
              },
              onChange(context) {
                console.log("on change", context);
              },
              onInput(context) {
                console.log("on input", context);
              },
            },
          },
        },
      },
      avatar: {
        title: "头像",
        search: { show: true },
        column: {
          align: "center",
          show: compute(() => {
            return true;
          }),
          component: {
            show: compute((context) => {
              return context.row?.show === true;
            }),
            name: "a-image",
            valueBinding: "src",
            width: "30px",
            height: "30px",
            fit: "contain",
            children: {
              error: () => {
                return (
                  <div class="image-slot">
                    <i class="el-icon-picture-outline" />
                  </div>
                );
              },
            },
          },
        },
        form: {
          component: {
            name: "a-image",
            valueBinding: "src",
            style: "width:70px",
          },
          style: {
            width: "100%;",
          },
          show: compute((context) => {
            console.log("show context", context);
            return context.form.show === false;
          }),
        },
      },
      show: {
        title: "显隐",
        column: {
          component: {
            name: "a-switch",
            valueBinding: "checked",
            events: {
              onChange(context) {
                console.log("switch context", context);
              },
            },
          },
        },
        form: {
          title: compute((context) => {
            console.log("xianyin ,", context);
            return context.form.show ? "隐藏头像" : "显示头像";
          }),
          component: {
            name: "a-switch",
            valueBinding: "checked",
          },
          style: {
            width: "100%;",
          },
        },
      },
      addressGroup: {
        title: "地址",
        children: {
          province: {
            title: "省份",
            type: "select",
            search: { show: true },
            dict: dict({
              url: "/dicts/OpenStatusEnum",
            }),
          },
          city: {
            title: "城市",
            type: "select",
            dict: dict({
              url: "/dicts/OpenStatusEnum",
            }),
          },
          address: {
            title: "地址",
            search: {
              show: true,
            },
            type: "text-area",
            form: {
              style: {
                "grid-column": "span 2",
              },
            },
          },
        },
      },
      zip: {
        title: "邮编",
        type: "text",
      },
    },
    rowHandle: {
      width: "350px",
      custom: [
        {
          text: "custom",
          click() {
            console.log("1111");
          },
        },
      ],
    },
    data: [],
  };
}
