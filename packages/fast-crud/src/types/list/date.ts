import { daterangeFormatter, datetimerangeFormatter } from "../functions";
import { uiContext } from "../../ui";
import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
import { ColumnCompositionProps, ValueBuilderContext } from "../../d";
import weekday from "dayjs/plugin/weekday";
import localeData from "dayjs/plugin/localeData";

dayjs.extend(weekday);
dayjs.extend(localeData);
dayjs.extend(weekOfYear);

export default function () {
  const ui = uiContext.get();

  function buildDateValue(scope: ValueBuilderContext) {
    const { row, key, value } = scope;
    if (value != null) {
      if (ui.type === "naive") {
        row[key] = dayjs(value).valueOf();
      } else if (ui.type === "antdv" && ui.version === "4") {
      } else if (ui.type === "element") {
        // row[key] = dayjs(value).valueOf();
      }
    }
  }

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
        width: 170,
        component: { name: "fs-date-format" }
      },
      valueBuilder(scope) {
        buildDateValue(scope);
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
      valueBuilder(scope) {
        buildDateValue(scope);
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
      valueBuilder(scope) {
        buildDateValue(scope);
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
      valueBuilder(scope) {
        buildDateValue(scope);
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
      valueBuilder(scope) {
        buildDateValue(scope);
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
      valueBuilder(scope) {
        buildDateValue(scope);
      }
    },
    year: {
      form: {
        component: {
          //el-date-picker,a-date-picker
          ...ui.datePicker.buildDateType("year"),
          vModel: ui.datePicker.modelValue
        }
      },
      column: {
        align: "center",
        width: 120,
        component: { name: "fs-date-format", format: "YYYY" }
      },
      valueBuilder(scope) {
        buildDateValue(scope);
      }
    }
  };
  return types;
}
