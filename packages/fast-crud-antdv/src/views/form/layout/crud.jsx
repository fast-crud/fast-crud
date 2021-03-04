import * as api from "./api";
import { dict, useExpose } from "/src/fs";
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
      display: "flex",
      wrapper: {
        onOpen(context) {
          //动态设置初始值
          if (context.mode === "add") {
            context.initial = { name: "初始姓名" };
          }
          console.log("form open", context);
        },
        onOpened(context) {
          context.options.display = context.options.initial.display;
          console.log("form opened", context, getFormData());
        },
        onClosed(context) {
          console.log("form closed", context, getFormData());
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
            console.log("crudRef", value, crudRef.value.formWrapperRef);
            crudRef.value.formWrapperRef.formOptions.display = value;
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
      intro: {
        title: "简介",
        type: "text-area",
        form: {
          col: {
            span: 24, // flex模式, 占两列
            style: { gridColumn: "span 2" }, // grid 模式占两列
          },
          labelCol: { span: 2 }, // antdv 跨列时，需要同时修改labelCol和wrapperCol
          wrapperCol: { span: 21 },
        },
      },
    },
  };
}
