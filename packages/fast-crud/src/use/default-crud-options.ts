import { uiContext } from "../ui";
export default {
  // eslint-disable-next-line @typescript-eslint/no-empty-function,@typescript-eslint/no-unused-vars
  commonOptions(ctx) {},
  defaultOptions({ t }) {
    const ui = uiContext.get();
    return {
      search: {
        options: {
          ...ui.form.inlineLayout,
          // n-form 是否显示校验反馈
          showFeedback: false
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
        labelPlacement: "left", // naive
        labelPosition: "right", //element
        labelWidth: "80px", //element
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
          style: {
            width: "960px" //naive
          },
          preset: "card",
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
        [ui.pagination.currentPage]: 1,
        [ui.pagination.total]: 1,
        pageSizes: [5, 10, 20, 50],
        layout: "total, sizes, prev, pager, next, jumper",
        showSizeChanger: true, // antdv
        showQuickJumper: true, // antdv
        showSizePicker: true, // naive
        showTotal: (total) => t("fs.pagination.showTotal", [total]) //antdv
      },
      table: {
        height: "100%",
        rowKey: ui.table.defaultRowKey,
        stripe: true,
        border: true,
        bordered: true,
        singleLine: false, //naive
        editable: { enabled: false }
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
