import { daterangeFormatter, datetimerangeFormatter } from "../functions";
import { uiContext } from "../../ui";
import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
import { ColumnCompositionProps } from "../../d";
dayjs.extend(weekOfYear);

export default function () {
  const ui = uiContext.get();
  const types: Record<string, ColumnCompositionProps> = {
    datetime: {
      form: {
        component: {
          //el-date-picker,a-date-picker
          ...ui.datePicker.buildDateType("datetime"),
          vModel: ui.datePicker.modelValue
        }
      },
      column: {
        width: "170px",
        component: { name: "fs-date-format" }
      },
      valueBuilder({ row, key, value }) {
        if (value != null) {
          if (ui.type === "naive") {
            row[key] = dayjs(value).valueOf();
          } else {
            row[key] = dayjs(value);
          }
        }
      }
    },
    date: {
      form: {
        component: {
          //el-date-picker,a-date-picker
          ...ui.datePicker.buildDateType("date"),
          vModel: ui.datePicker.modelValue
        }
      },
      column: {
        align: "center",
        width: 120,
        component: { name: "fs-date-format", format: "YYYY-MM-DD" }
      },
      valueBuilder({ row, key, value }) {
        if (value != null) {
          if (ui.type === "naive") {
            row[key] = dayjs(value).valueOf();
          } else {
            row[key] = dayjs(value);
          }
        }
      }
    },
    daterange: {
      form: {
        component: {
          //el-date-picker,a-date-picker
          ...ui.datePicker.buildDateType("daterange"),
          vModel: ui.datePicker.modelValue
        }
      },
      column: { width: 210, formatter: daterangeFormatter },
      valueBuilder({ row, key, value }) {
        if (value != null && Array.isArray(value) && value.length === 2) {
          if (value != null) {
            if (ui.type === "naive") {
              row[key] = [dayjs(value[0]).valueOf(), dayjs(value[1]).valueOf()];
            } else {
              row[key] = [dayjs(value[0]), dayjs(value[1])];
            }
          }
        }
      }
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
      },
      valueBuilder({ row, key, value }) {
        if (value != null && Array.isArray(value) && value.length === 2) {
          if (ui.type === "naive") {
            row[key] = [dayjs(value[0]).valueOf(), dayjs(value[1]).valueOf()];
          } else {
            row[key] = [dayjs(value[0]), dayjs(value[1])];
          }
        }
      }
    },
    time: {
      form: {
        component: {
          //el-time-picker,a-time-picker
          name: ui.timePicker.name,
          vModel: ui.timePicker.modelValue
        }
      },
      column: {
        width: 100,
        align: "center",
        component: { name: "fs-date-format", format: "HH:mm:ss" }
      },
      valueBuilder({ row, key, value }) {
        if (ui.type === "naive") {
          row[key] = dayjs(value).valueOf();
        } else {
          row[key] = dayjs(value);
        }
      }
    },
    month: {
      form: {
        component: {
          //el-date-picker,a-date-picker
          ...ui.datePicker.buildDateType("month"),
          vModel: ui.datePicker.modelValue
        }
      },
      column: {
        align: "center",
        width: 120,
        component: { name: "fs-date-format", format: "YYYY-MM" }
      },
      valueBuilder({ row, key, value }) {
        if (ui.type === "naive") {
          row[key] = dayjs(value).valueOf();
        } else {
          row[key] = dayjs(value);
        }
      }
    },
    week: {
      form: {
        component: {
          //el-date-picker,a-date-picker
          ...ui.datePicker.buildDateType("week"),
          vModel: ui.datePicker.modelValue
        }
      },
      column: {
        align: "center",
        width: 120,
        component: { name: "fs-date-format", format: "YYYY-ww[周]" }
      },
      valueBuilder({ row, key, value }) {
        if (ui.type === "naive") {
          row[key] = dayjs(value).valueOf();
        } else {
          row[key] = dayjs(value);
        }
      }
    },
    quarter: {
      form: {
        component: {
          //el-date-picker,a-date-picker
          ...ui.datePicker.buildDateType("quarter"),
          vModel: ui.datePicker.modelValue
        }
      },
      column: {
        align: "center",
        width: 120,
        component: { name: "fs-date-format", format: "YYYY-[Q]Q" }
      },
      valueBuilder({ row, key, value }) {
        if (ui.type === "naive") {
          row[key] = dayjs(value).valueOf();
        } else {
          row[key] = dayjs(value);
        }
      }
    },
    year: {
      form: {
        component: {
          //el-date-picker,a-date-picker
          ...ui.datePicker.buildDateType("year"),
          vModel: ui.datePicker.modelValue,
          format: "yyyy"
        }
      },
      column: {
        align: "center",
        width: 120,
        component: { name: "fs-date-format", format: "YYYY" }
      },
      valueBuilder({ row, key, value }) {
        if (ui.type === "naive") {
          row[key] = dayjs(value).valueOf();
        } else {
          row[key] = dayjs(value);
        }
      }
    }
  };
  return types;
}
