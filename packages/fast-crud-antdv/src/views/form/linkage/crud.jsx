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
  const delRequest = async (id) => {
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
      delRequest,
    },
    columns: {
      id: {
        title: "ID",
        key: "id",
        type: "number",
        column: {
          width: 50,
        },
        form: {
          show: false,
        },
      },
      province: {
        title: "省",
        type: "dict-select",
        search: {
          show: true,
        },
        dict: dict({
          url: "/linkage/province",
          value: "id",
        }),
      },
      // city: {
      //   title: "市",
      //   type: "dict-select",
      //   search: {
      //     show: false,
      //   },
      //   dict: dict({
      //     // url() 改成构建url，返回一个url
      //     url({ scope }) {
      //       const { form } = scope;
      //       if (form && form.province != null) {
      //         // 本数据字典的url是通过前一个select的选项决定的
      //         return "/linkage/city?province=" + form.province;
      //       }
      //       return undefined; // 返回undefined 将不加载字典
      //     },
      //     value: "id",
      //   }),
      //   // form: {
      //   //   component: { props: { dict: { cache: false } } },
      //   //   // 注释同上
      //   //   valueChange({ value, form, getComponent }) {
      //   //     if (value) {
      //   //       form.county = undefined; // 将county的value置空
      //   //       const countySelect = getComponent("county");
      //   //       if (form && form.province && form.city) {
      //   //         countySelect.reloadDict(); // 重新加载字典项
      //   //       } else {
      //   //         countySelect.clearDict(); // 清空选项
      //   //       }
      //   //     }
      //   //   },
      //   // },
      // },
      // county: {
      //   title: "区",
      //   type: "dict-select",
      //   search: {
      //     show: false,
      //   },
      //   dict: dict({
      //     value: "id",
      //     url({ scope }) {
      //       const { form } = scope;
      //       if (form == null) {
      //         console.log("scope------------", scope);
      //         return;
      //       }
      //       if (form.province != null && form.city != null) {
      //         return (
      //           "/linkage/county?province=" +
      //           form.province +
      //           "&city=" +
      //           form.city
      //         );
      //       }
      //       return undefined;
      //     },
      //   }),
      //   // form: {
      //   //   component: { props: { dict: { cache: false } } },
      //   //   valueChange({ value }) {
      //   //     console.log("您选择了：", value);
      //   //   },
      //   // },
      // },
    },
  };
}
