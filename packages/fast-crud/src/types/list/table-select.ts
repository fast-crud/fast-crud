import { uiContext } from "../../ui";
export default function () {
  const ui = uiContext.get();
  return {
    "table-select": {
      column: { component: { name: "fs-values-format", vModel: "modelValue" } },
      form: {
        component: {
          name: "fs-table-select"
        }
      }
    }
  };
}
