import { uiContext } from "../../ui";
export default function () {
  const ui = uiContext.get();
  return {
    select: {
      search: { autoSearchTrigger: "change" },
      form: {
        component: {
          name: ui.select.name,
          [ui.select.clearable]: true
        }
      }
    },
    "dict-select": {
      search: { autoSearchTrigger: "change" },
      column: { component: { name: "fs-values-format", vModel: "modelValue" } },
      form: {
        component: {
          name: "fs-dict-select",
          vModel: ui.select.modelValue,
          [ui.select.clearable]: true
        }
      }
    },
    "table-select": {
      column: { component: { name: "fs-values-format", vModel: "modelValue" } },
      form: {
        component: {
          name: "fs-table-select"
        }
      }
    },
    "editable-select": {
      column: { component: { name: "fs-values-format", vModel: "modelValue" } },
      form: {
        component: {
          name: "fs-editable-select"
        }
      }
    },
    "dict-radio": {
      search: {
        component: {
          name: "fs-dict-select",
          vModel: ui.select.modelValue,
          autoSearchTrigger: "change"
        }
      },
      form: {
        component: {
          name: "fs-dict-radio",
          vModel: ui.radioGroup.modelValue,
          [ui.select.clearable]: true
        }
      },
      column: { component: { name: "fs-values-format", vModel: "modelValue" } }
    },
    "dict-checkbox": {
      search: {
        component: { name: "fs-dict-select" },
        autoSearchTrigger: "change"
      },
      form: {
        component: {
          name: "fs-dict-checkbox",
          vModel: ui.radioGroup.modelValue,
          [ui.select.clearable]: true
        }
      },
      column: { component: { name: "fs-values-format", vModel: "modelValue" } }
    },
    "dict-switch": {
      search: {
        component: { name: "fs-dict-select", vModel: ui.select.modelValue },
        autoSearchTrigger: "change"
      },
      form: {
        component: {
          name: "fs-dict-switch",
          vModel: ui.switch.modelValue,
          [ui.select.clearable]: true
        }
      },
      column: { component: { name: "fs-values-format", vModel: "modelValue" } }
    }
  };
}
