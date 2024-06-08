import { useUi } from "@fast-crud/ui-interface";

export default function () {
  const { ui } = useUi();
  return {
    number: {
      form: { component: { name: ui.number.name, props: {} } },
      align: "center"
    },
    switch: {
      form: { component: { name: ui.switch.name, props: {} } },
      component: { name: ui.switch.name, props: {} },
      align: "center"
    },
    slider: {
      form: { component: { name: "el-slider", props: {} } },
      align: "center"
    },
    rate: {
      form: { component: { name: "el-rate", props: {} } },
      align: "center"
    },
    "color-picker": {
      form: { component: { name: "el-color-picker", props: {} } },
      align: "center"
    },
    transfer: {
      form: { component: { name: "el-transfer", props: {} } },
      align: "center"
    },
    autocomplete: {
      form: { component: { name: "el-autocomplete", props: {} } }
    }
  };
}
