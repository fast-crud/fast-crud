import * as api from "./api";
import { requestForMock } from "/src/api/service";
import { dict } from "/src/fs";
export default function ({ crudRef }) {
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
        cascader: {
          title: "级联",
          search: { show: true },
          type: "dict-cascader",
          dict: dict({
            isTree: true,
            url: "/dicts/cascaderData?single"
          })
        },
        lazyLoad: {
          title: "懒加载",
          type: "dict-cascader",
          dict: dict({
            url: "/tree/GetTreeChildrenByParentId?lazyLoad",
            value: "code",
            label: "name",
            isTree: true,
            cache: true,
            prototype: true,
            async getNodesByValues(values) {
              if (values == null) {
                return [];
              }
              //用于单元格展示
              const ret = await requestForMock({
                url: "/tree/GetNodesByValues",
                params: { values }
              });
              console.log("getNodes", ret);
              return ret;
            }
          }),
          form: {
            component: {
              props: {
                props: {
                  lazy: true,
                  value: "code",
                  label: "name",
                  async lazyLoad(node, resolve) {
                    console.log("node", node);
                    const { value } = node;
                    const ret = await requestForMock({
                      url: "/tree/GetTreeChildrenByParentId",
                      params: { parentId: value }
                    });
                    resolve(ret);
                  }
                }
              }
            }
          }
        },
        multiple: {
          title: "多选",
          type: "dict-cascader",
          dict: dict({
            isTree: true,
            url: "/dicts/cascaderData?multiple"
          }),
          form: {
            component: {
              filterable: true,
              // props下配置属性跟配置在component下是一样的效果，而el-cascade下也有一个叫props的属性，所以需要配置两层
              props: { props: { multiple: true, checkStrictly: true } }
            },
            helper: "可搜索，多选，可只选父节点"
          },
          column: {
            //级联多选展示
            component: {
              multiple: true
            }
          }
        }
      }
    }
  };
}
