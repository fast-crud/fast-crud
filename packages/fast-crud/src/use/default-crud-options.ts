import { uiContext } from "../ui";
import { CrudOptions, UseCrudProps } from "../d";
export default {
  commonOptions(ctx?: UseCrudProps): any {
    return {};
  },
  defaultOptions(opts: { t: any }): {
    mode: {};
    toolbar: { compact: boolean };
    search: {
      container: { col: { span: number }; is: string; collapse: boolean };
      buttons: { search: { icon: string }; reset: { icon: string } };
      options: {
        isPrototypeOf(v: Object): boolean;
        hasOwnProperty(v: PropertyKey): boolean;
        propertyIsEnumerable(v: PropertyKey): boolean;
        valueOf(): Object;
        constructor: Function;
        toString(): string;
        toLocaleString(): string;
        showFeedback: boolean;
      };
      show: boolean;
      onValidateError({ trigger }: any): void;
      collapse: boolean;
    };
    pagination: {
      [p: string]: number;
      layout: string;
      pageSizes: number[];
      background: boolean;
      showTotal: (total: number) => any;
      pageSize: number;
      showQuickJumper: boolean;
      showSizePicker: boolean;
      showSizeChanger: boolean;
    };
    form: {
      col: { span: number };
      labelPosition: string;
      labelAlign: string;
      wrapperCol: { span: number };
      labelWidth: string;
      style: { "grid-template-columns": string };
      wrapper: {
        [p: string]: any;
        buttons: {
          cancel: { text: any; click: ({ close }: { close: any }) => void };
          reset: { text: any; click: ({ reset }: { reset: any }) => void };
          ok: { text: any; type: string; loading: any; click: ({ submit }: { submit: any }) => Promise<void> };
        };
        draggable: boolean;
        is: string;
        destroyOnClose: boolean;
      };
      row: { gutter: number };
      labelCol: { span: number };
      labelPlacement: string;
    };
    addForm: { wrapper: { title: any } };
    editForm: { wrapper: { title: any } };
    viewForm: { wrapper: { title: any } };
    rowHandle: {
      width: string;
      title: any;
      dropdown: { more: { icon: string; text: null; type: string } };
      order: number;
    };
    actionbar: { buttons: { add: { text: any; type: string } } };
    table: {
      border: boolean;
      pagination: boolean;
      editable: { enabled: boolean; rowKey: string };
      show: boolean;
      stripe: boolean;
      bordered: boolean;
      singleLine: boolean;
      rowKey: string | ((rowData: any) => any);
      height: string;
    };
    status: {};
  } {
    const { t } = opts;
    const ui = uiContext.get();
    return {
      mode: {},
      status: {},
      search: {
        container: {
          is: "fs-search-layout-default",
          collapse: true,
          col: {
            span: 4
          }
        },
        options: {
          ...ui.form.inlineLayout,
          // n-form 是否显示校验反馈
          showFeedback: false
        },
        onValidateError({ trigger }: any) {
          if (trigger === "search") {
            ui.notification.error({ message: t("fs.search.error.message") });
          }
        },
        collapse: true,
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
        row: {
          gutter: 10
        },
        col: { span: 12 },
        labelAlign: "right", // antdv
        labelCol: { span: 4 }, // antdv
        wrapperCol: { span: 18 }, // antdv
        wrapper: {
          is: ui.dialog.name,
          ...ui.formWrapper.buildWidthBind(ui.dialog.name, "960px"),
          ...ui.formWrapper.buildInitBind(ui.dialog.name),
          draggable: true,
          destroyOnClose: true, // antdv
          ...ui.dialog.footer(), // antdv
          buttons: {
            cancel: {
              text: t("fs.form.cancel"),
              order: 1,
              click: ({ close }) => {
                close();
              }
            },
            reset: {
              text: t("fs.form.reset"),
              order: 1,
              click: ({ reset }) => {
                reset();
              }
            },
            ok: {
              text: t("fs.form.ok"),
              order: 1,
              type: "primary",
              click: async ({ submit }) => {
                await submit();
              }
            }
          }
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
        order: 1000,
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
        showTotal: (total: number) => t("fs.pagination.showTotal", [total]) //antdv
      },
      table: {
        show: true,
        height: "100%",
        rowKey: ui.table.defaultRowKey,
        stripe: true,
        border: true,
        bordered: true,
        singleLine: false, //naive
        editable: { enabled: false, rowKey: "$editable_id" },
        pagination: false //antdv 关闭默认分页
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
