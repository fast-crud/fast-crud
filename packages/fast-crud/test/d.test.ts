import { computed, ref } from "vue";
import { asyncCompute, compute, DynamicallyCrudOptions } from "../src";

const crudOptions: DynamicallyCrudOptions = {
  table: {
    scroll: {
      x: 1500
    },
    //通过switch动态显隐table
    show: computed(() => {
      return true;
    })
  },
  form: {
    labelCol: { span: 8 },
    wrapperCol: ref({ span: 14 })
  },
  rowHandle: {
    fixed: "right",
    show: computed(() => {
      return "111";
    }),
    buttons: {
      edit: {
        show: compute<boolean>(({ row }) => {
          return row.editable;
        }),
        icon: false
      },
      remove: {
        show: compute(({ row }) => {
          return row.editable;
        }),
        icon: asyncCompute<boolean>({
          async asyncFn() {
            return false;
          }
        })
      },
      custom: compute(({ row }) => {
        return {
          text: "动态按钮:" + row.id,
          show: true
        };
      })
    }
  },
  columns: {
    id: {
      title: "ID",
      key: "id",
      type: "number",
      column: {
        width: 50,
        resizable: true
      },
      form: {
        show: false
      }
    },
    refSwitch: {
      title: "ref引用切换",
      type: "text",
      form: {
        helper: "点我切换右边的输入框显示"
      }
    },
    ref: {
      title: "根据ref引用显示",
      type: ["text"],
      form: {
        component: {
          show: ref(true)
        },
        helper: "我会根据showRef进行显隐"
      }
    },
    compute: {
      title: "compute",
      search: { show: false },
      type: "text",
      column: {
        show: compute(() => {
          return true;
        }),
        columnSetDisabled: ref(false as any), //这里采用自定义控制显隐，那么列设置里面就要禁用
        // columnSetShow: false, //直接不在列设置里面显示也行
        component: {
          name: "a-switch",
          vModel: "checked"
        }
      },
      form: {
        component: {
          name: "a-switch",
          vModel: "checked"
        },
        helper: "点我触发动态计算"
      }
    },
    shower: {
      title: "根据compute显示",
      search: { show: false },
      type: "button",
      form: {
        component: {
          show: compute(({ form }) => {
            return form.compute;
          })
        }
      },
      column: {
        width: 250,
        resizable: true,
        component: {
          show: compute(({ row }) => {
            return row.compute;
          })
        }
      }
    },
    remote: {
      title: "asyncCompute",
      search: { show: true },
      type: "text",
      form: {
        component: {
          name: "a-select",
          vModel: "value",
          placeholder: "异步计算远程获取options",
          options: asyncCompute({
            async asyncFn(watchValue, context) {
              return [];
            }
          })
        },
        helper: "我的options是异步计算远程获取的,只会获取一次"
      }
    },
    remote2: {
      title: "监听switch触发异步计算",
      search: { show: false },
      type: "text",
      form: {
        component: {
          name: "a-select",
          vModel: "value",
          placeholder: "异步计算远程获取options",
          options: asyncCompute({
            watch({ form }: any) {
              return form.compute;
            },
            async asyncFn(watchValue) {
              return [];
            }
          })
        },
        helper: "监听其他属性修改后，触发重新计算"
      },
      column: {
        width: 200
      }
    },
    editable: {
      title: "可编辑",
      search: { show: false },
      type: "text",
      column: {
        fixed: "right",
        component: {
          name: "a-switch",
          vModel: "checked"
        }
      },
      form: {
        show: false
      }
    }
  }
};
