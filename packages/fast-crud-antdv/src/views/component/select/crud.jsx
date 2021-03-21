import * as api from "./api";
import { requestForMock } from "/src/api/service";
import { dict } from "/src/fs";
export default function({ expose }) {
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
    form: {
      // 单列布局
      col: { span: 24 },
      labelCol: { span: 4 },
      wrapperCol: { span: 18 }
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
      statusLocal: {
        title: "单选本地",
        type: "dict-select",
        dict: dict({
          value: "id",
          label: "text",
          data: [
            { id: "sz", text: "深圳", color: "success" },
            { id: "gz", text: "广州", color: "blue" },
            { id: "bj", text: "北京" },
            { id: "wh", text: "武汉" },
            { id: "sh", text: "上海" }
          ]
        })
      },
      statusRemote: {
        title: "单选远程",
        search: {
          show: true,
          rules: null,
          component: {
            style: { width: "100px" }
          }
        },
        type: "dict-select",
        dict: dict({
          value: "id",
          label: "text",
          url: "/dicts/_OpenStatusEnum2?simple"
        }),
        form: {
          rules: [{ required: true, message: "请选择一个选项" }]
        }
      },
      customDictGetData: {
        title: "自定义字典请求",
        sortable: true,
        search: {},
        width: 120,
        type: "dict-select",
        dict: dict({
          getData({ dict }) {
            // 覆盖全局获取字典请求配置
            console.log(`我是从自定义的getData方法中加载的数据字典`, dict);
            return requestForMock({
              url: "/dicts/OpenStatusEnum?cache",
              method: "get"
            });
          }
        }),
        form: {
          value: "2",
          component: {
            value: "2" // 默认值
          },
          helper: "dict.getData可以覆盖全局配置的getRemoteDictFunc"
        },
        component: {
          props: {
            type: "text" // 不使用tab，纯文本展示
          }
        }
      },
      disabledOptions: {
        title: "禁用某个选项",
        key: "disabledOptions",
        type: "dict-select",
        dict: dict({
          url: "/dicts/OpenStatusEnum?disabledOptions"
        }),
        form: {
          component: {
            dict: {
              // 此处dict配置会覆盖上面dict的属性
              cache: false, // 每次初始化组件都会重新获取dict
              //因为分发时会clone一份，此处修改不影响其他的dict配置
              onReady({ dict }) {
                console.log("字典请求ready", dict);
                dict.data[0].disabled = true; // 禁用某个选项， 还可以自己修改选项，如果没有禁用缓存，则可能会影响全局
              }
            }
          },
          helper: "禁用字典选项"
        }
      },
      multiple: {
        title: "多选自动染色",
        sortable: true,
        width: 180,
        type: "dict-select",
        form: {
          title: "多选本地",
          component: {
            mode: "multiple"
          }
        },
        dict: dict({
          data: [
            { value: "sz", label: "深圳", color: "success" },
            { value: "gz", label: "广州" },
            { value: "wh", label: "武汉" },
            { value: "sh", label: "上海" },
            { value: "hz", label: "杭州" },
            { value: "bj", label: "北京", color: "red" }
          ]
        }),
        column: {
          component: { color: "auto" } // 自动染色
        }
      },
      statusSimple: {
        title: "普通选择",
        type: "select",
        form: {
          component: {
            options: [
              { value: "sz", label: "深圳", color: "success" },
              { value: "gz", label: "广州", color: "blue" },
              { value: "bj", label: "北京" },
              { value: "wh", label: "武汉" },
              { value: "sh", label: "上海" }
            ]
          }
        }
      }
    }
  };
}
