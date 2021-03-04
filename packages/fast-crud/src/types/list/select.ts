import { uiContext } from "../../ui";
export default function () {
  const ui = uiContext.get();
  return {
    "dict-select": {
      search: { autoSearchTrigger: "change" },
      column: { component: { name: "fs-values-format" } },
      form: {
        component: {
          name: "fs-dict-select",
          valueBinding: ui.select.modelValue,
          [ui.select.clearable]: true,
        },
      },
    },
    "dict-radio": {
      search: {
        component: {
          name: "fs-dict-select",
          valueBinding: ui.select.modelValue,
          autoSearchTrigger: "change",
        },
      },
      form: {
        component: {
          name: "fs-dict-radio",
          valueBinding: ui.radioGroup.modelValue,
          [ui.select.clearable]: true,
        },
      },
      column: { component: { name: "fs-values-format" } },
    },
    "dict-checkbox": {
      search: {
        component: { name: "fs-dict-select", multiple: true },
        autoSearchTrigger: "change",
      },
      form: {
        component: { name: "fs-dict-checkbox", [ui.select.clearable]: true },
      },
      column: { component: { name: "fs-values-format" } },
    },
    "dict-switch": {
      search: {
        component: { name: "fs-dict-switch", multiple: true },
        autoSearchTrigger: "change",
      },
      form: {
        component: { name: "fs-dict-switch", [ui.select.clearable]: true },
      },
      column: { component: { name: "fs-values-format" } },
    },
  };
}
