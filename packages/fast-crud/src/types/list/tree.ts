import { uiContext } from "../../ui";
export default function () {
  const ui = uiContext.get();
  return {
    "dict-tree": {
      search: { autoSearchTrigger: "change" },
      column: { component: { name: "fs-values-format", vModel: "modelValue" } },
      form: {
        component: {
          name: "fs-dict-tree",
          vModel: ui.treeSelect.modelValue,
          [ui.treeSelect.clearable]: true
        }
      }
    }
  };
}
