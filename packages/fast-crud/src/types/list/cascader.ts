import { uiContext } from "../../ui";

export default function () {
  const ui = uiContext.get();

  return {
    "dict-cascader": {
      search: {
        component: {
          clearable: true
        }
      },
      form: {
        component: {
          name: "fs-dict-cascader",
          vModel: ui.cascader.modelValue,
          [ui.cascader.clearable]: true
        }
      },
      column: {
        component: { name: "fs-dict-cascader-format" }
      }
    }
  };
}
