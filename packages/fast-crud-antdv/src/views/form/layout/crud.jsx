import * as api from "./api";
import { dict, useExpose, compute } from "/src/fs";
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

  const { getFormData } = useExpose(crudRef);
  return {
    request: {
      pageRequest,
      addRequest,
      editRequest,
      delRequest,
    },
    form: {
      /**
       * flex模式，通过
       * grid模式
       */
      display: "flex",
      wrapper: {
        customClass: "page-layout",
        onOpened(context) {
          context.options.display = context.options.initial?.display;
          console.log("form opened", context, getFormData());
        },
      },
    },
    columns: {
      display: {
        title: "布局",
        type: "dict-radio",
        dict: dict({
          data: [
            { value: "flex", label: "flex", color: "blue" },
            { value: "grid", label: "grid", color: "green" },
          ],
        }),
        form: {
          valueChange(context) {
            const { value } = context;
            console.log("valueChange", value, context);
            context.form.display = value;
          },
        },
      },
      name: {
        title: "姓名",
        type: "text",
        search: { show: true },
      },
      zip: {
        title: "邮编",
        type: "text",
      },
      gridSpan: {
        title: "grid跨列",
        type: "text-area",
        form: {
          col: {
            style: { gridColumn: "span 2" }, // grid 模式
          },
        },
      },
      flexSpan: {
        title: "flex跨列",
        type: "text-area",
        form: {
          show: compute((context) => {
            return context.form.display !== "grid";
          }),
          col: {
            span: 24, // flex模式
          },
          labelCol: { span: 2 }, // antdv 跨列时，需要同时修改labelCol和wrapperCol
          wrapperCol: { span: 21 },
        },
      },
    },
  };
}
