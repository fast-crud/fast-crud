import { uiContext } from "../ui";
export default {
  // eslint-disable-next-line @typescript-eslint/no-empty-function,@typescript-eslint/no-unused-vars
  commonOptions() {},
  defaultOptions({ t }) {
    const ui = uiContext.get();
    return {
      search: {
        options: {
          layout: "inline",
          inline: true
        },
        show: true,
        buttons: {
          search: {
            icon: ui.icons.search
          },
          reset: {
            icon: ui.icons.refresh
          }
        }
      },
      form: {
        labelPosition: "right",
        labelWidth: "80px",
        style: {
          "grid-template-columns": "50% 50%" // grid布局，默认两列
        },
        col: { span: 12 },
        labelAlign: "right", // antdv
        labelCol: { span: 4 }, // antdv
        wrapperCol: { span: 18 }, // antdv
        wrapper: {
          is: ui.dialog.name,
          width: "960px",
          destroyOnClose: true, // antdv
          ...ui.dialog.footer() // antdv
        }
      },
      addForm: {
        wrapper: {
          title: t("fs.addForm.title")
        }
      },
      editForm: {
        wrapper: {
          title: t("fs.editForm.title")
        }
      },
      viewForm: {
        wrapper: {
          title: t("fs.viewForm.title")
        }
      },
      rowHandle: {
        width: "250px",
        title: t("fs.rowHandle.title"),
        dropdown: {
          // 操作列折叠
          more: {
            text: null, // dropdown按钮文字
            type: "primary",
            icon: ui.icons.more
          }
        }
      },
      pagination: {
        background: true,
        pageSize: 20,
        pageSizes: [5, 10, 20, 50],
        layout: "total, sizes, prev, pager, next, jumper",
        showSizeChanger: true, // antdv
        showQuickJumper: true, // antdv
        showTotal: (total) => t("fs.pagination.showTotal", [total]) //antdv
      },
      table: {
        height: "100%",
        rowKey: "id",
        stripe: true,
        border: true,
        bordered: true
      },
      toolbar: {
        compact: true
      },
      actionbar: {
        buttons: {
          add: {
            type: "primary",
            text: t("fs.actionbar.add")
          }
        }
      }
    };
  }
};
