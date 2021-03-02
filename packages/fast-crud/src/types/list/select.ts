import { uiContext } from "../../ui";
export default function () {
  const ui = uiContext.get();
  return {
    select: {
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
    radio: {
      search: {
        component: { name: "fs-dict-select", autoSearchTrigger: "change" },
        form: {
          component: { name: "fs-dict-radio", [ui.select.clearable]: true },
        },
        column: { component: { name: "fs-values-format" } },
      },
      checkbox: {
        search: {
          component: { name: "fs-dict-select", multiple: true },
          autoSearchTrigger: "change",
        },
        form: {
          component: { name: "fs-dict-checkbox", [ui.select.clearable]: true },
        },
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
