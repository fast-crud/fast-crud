import { uiContext } from "../ui";
import { DynamicallyCrudOptions, UseCrudProps } from "../d";
import { computed } from "vue";

const defaultCrudOptions = {
  commonOptions(ctx?: UseCrudProps<any, any>): any {
    return {};
  },
  defaultOptions(opts: { t: any }): DynamicallyCrudOptions<any> {
    const { t } = opts;
    const ct = (name: string) => {
      return computed(() => {
        return t(name);
      });
    };
    const ui = uiContext.get();
    return {
      settings: {
        plugins: {
          mobile: {
            enabled: true,
            props: {
              isMobile: computed(() => {
                //浏览器窗口小于768px时，认为是手机端
                //你也可以实现自己的判断手机版逻辑
                return window.innerWidth < 768;
              })
            }
          }
        }
      },
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
        formItem: {
          wrapperCol: {
            style: {
              width: "50%"
            }
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
            className: {
              "fs-search-btn-search": true
            },
            icon: ui.icons.search
          },
          reset: {
            className: {
              "fs-search-btn-reset": true
            },
            icon: ui.icons.refresh
          }
        }
      },
      form: {
        labelPlacement: "left", // naive
        labelPosition: "right", //element
        labelWidth: "120px", //element
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
          dragenabled: true,
          destroyOnClose: true, // antdv
          ...ui.dialog.footer(), // antdv
          buttons: {
            cancel: {
              text: ct("fs.form.cancel"),
              order: 1,
              click: ({ doClose }) => {
                doClose();
              }
            },
            reset: {
              text: ct("fs.form.reset"),
              order: 1,
              click: ({ reset }) => {
                reset();
              }
            },
            ok: {
              text: ct("fs.form.ok"),
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
          title: ct("fs.addForm.title")
        }
      },
      editForm: {
        wrapper: {
          title: ct("fs.editForm.title")
        }
      },
      viewForm: {
        wrapper: {
          title: ct("fs.viewForm.title"),
          buttons: {
            reset: {
              show: false
            },
            cancel: {
              show: false
            }
          }
        }
      },
      rowHandle: {
        width: 250,
        title: ct("fs.rowHandle.title"),
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
        scrollTopOnRefreshed: true,
        editable: { enabled: false, rowKey: "$editable_id" },
        pagination: false //antdv 关闭默认分页
      },
      toolbar: {
        compact: true,
        buttons: {
          search: {
            className: {
              "fs-toolbar-btn-search": true
            }
          },
          compact: {
            className: {
              "fs-toolbar-btn-compact": true
            }
          },
          refresh: {
            className: {
              "fs-toolbar-btn-refresh": true
            }
          },
          export: {
            className: {
              "fs-toolbar-btn-export": true
            }
          },
          columns: {
            className: {
              "fs-toolbar-btn-columns": true
            }
          }
        }
      },
      actionbar: {
        buttons: {
          add: {
            className: {
              "fs-actionbar-btn-add": true
            },
            type: "primary",
            text: ct("fs.actionbar.add")
          }
        }
      }
    };
  }
};

export default defaultCrudOptions;
