import { daterangeFormatter, datetimerangeFormatter, shortcuts } from "../functions";
import { uiContext } from "../../ui";

export default function () {
  const ui = uiContext.get();
  return {
    datetime: {
      form: {
        component: {
          ...ui.datePicker.buildDateType("datetime"),
          vModel: ui.datePicker.modelValue
        }
      },
      column: {
        width: "170px",
        component: { name: "fs-date-format" }
      }
    },
    date: {
      form: {
        component: {
          ...ui.datePicker.buildDateType("date"),
          vModel: ui.datePicker.modelValue
        }
      },
      column: {
        align: "center",
        width: "120px",
        component: { name: "fs-date-format", format: "YYYY-MM-DD" }
      }
    },
    daterange: {
      form: {
        component: {
          ...ui.datePicker.buildDateType("daterange"),
          vModel: ui.datePicker.modelValue
        }
      },
      column: { width: 210, formatter: daterangeFormatter }
    },
    datetimerange: {
      form: {
        component: {
          ...ui.datePicker.buildDateType("datetimerange"),
          vModel: ui.datePicker.modelValue
        }
      },
      column: {
        width: 340,
        formatter: datetimerangeFormatter
      }
    },
    time: {
      form: {
        component: {
          name: ui.timePicker.name,
          vModel: ui.timePicker.modelValue
        }
      },
      column: {
        component: { name: "fs-date-format", format: "HH:mm:ss" }
      }
    }
  };
}
