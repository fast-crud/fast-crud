import * as api from "./api";
import { requestForMock } from "/src/api/service";
import { dict } from "@fast-crud/fast-crud";
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
      form: {
        // 单列布局
        // col: { span: 24 }
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
          search: { show: true },
          dict: dict({
            value: "id",
            label: "text",
            data: [
              { id: "sz", text: "深圳", color: "success" },
              { id: "gz", text: "广州", color: "primary" },
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
            url: "/dicts/OpenStatusEnum?simple"
          }),
          form: {
            rules: [{ required: true, message: "请选择一个选项" }]
          }
        },
        customDictGetData: {
          title: "自定义字典请求",
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
            value: "2", //默认值
            helper: "dict.getData可以覆盖全局配置的getRemoteDictFunc"
          },
          column: {
            width: "130px",
            component: {
              type: "text" // 不使用tab，纯文本展示
            }
          }
        },
        disabledOptions: {
          title: "禁用某个选项",
          type: "dict-select",
          dict: dict({
            cloneable: true,
            url: "/dicts/OpenStatusEnum?disabledOptions"
          }),
          form: {
            component: {
              dict: {
                // 此处dict配置会覆盖上面dict的属性
                prototype: true, // form表单的dict设置为原型复制，每次初始化时都会重新loadDict
                onReady({ dict }) {
                  console.log("字典请求ready", dict);
                  dict.data[0].disabled = true; // 禁用某个选项， 还可以自己修改选项
                }
              }
            },
            helper: "禁用字典选项"
          }
        },
        firstDefault: {
          title: "默认值",
          type: "dict-select",
          dict: dict({
            cloneable: true,
            url: "/dicts/OpenStatusEnum?disabledOptions"
          }),
          form: {
            //value:'0',//如果知道选项value，配置此项即可设置默认值
            // 下方演示获取远程的字典数据来设置第一个选项为默认值
            component: {
              //监听 dict-change事件
              onDictChange({ dict, form, key }) {
                console.log("dict data changed", dict, key);
                if (dict.data != null && form.firstDefault == null) {
                  form.firstDefault = dict.data[0].value;
                }
              }
              // 下面的方法也可以，注意要配置dict.prototype:true
              // dict: {
              //   // 此处dict配置会覆盖上面dict的属性
              //   // form表单的dict设置为原型复制，每次初始化时都会重新loadDict
              //   prototype: true,
              //
              //   onReady({ dict, form }) {
              //     console.log("字典请求ready", dict, form, getComponentRef);
              //     //  prototype= true 才能获取到form表单数据
              //     form.firstDefault = dict.data[0].value;
              //   }
              // }
            },
            helper: "默认选择第一个选项"
          }
        },
        multiple: {
          title: "多选自动染色",
          type: "dict-select",
          search: { show: false },
          form: {
            title: "多选本地",
            component: {
              multiple: true
            }
          },
          dict: dict({
            data: [
              { value: "sz", label: "深圳", color: "success" },
              { value: "gz", label: "广州" },
              { value: "wh", label: "武汉" },
              { value: "sh", label: "上海" },
              { value: "hz", label: "杭州" },
              { value: "bj", label: "北京", color: "danger" }
            ]
          }),
          column: {
            sortable: true,
            width: 180,
            component: { color: "auto" } // 自动染色
          }
        }
      }
    }
  };
}
