import * as api from "./api";
import { utils } from "@fast-crud/fast-crud";
import moment from "moment";
console.log("utils", utils);
export default function ({ crudRef }) {
  const pageRequest = async (query) => {
    return await api.GetList(query);
  };
  const editRequest = async ({ form, row }) => {
    form.id = row.id;
    return await api.UpdateObj(form);
  };
  const delRequest = async ({ row }) => {
    return await api.DelObj(row.id);
  };

  const addRequest = async ({ form }) => {
    return await api.AddObj(form);
  };
  return {
    crudOptions: {
      request: {
        pageRequest,
        addRequest,
        editRequest,
        delRequest
      },
      table: {
        scroll: { x: 1700 }
      },
      rowHandle: { fixed: "right" },
      columns: {
        id: {
          title: "ID",
          key: "id",
          type: "number",
          column: {
            width: 50
          },
          form: {
            show: false
          }
        },
        timestamp: {
          title: "时间戳",
          type: "datetime",
          search: { show: true, width: 185 },
          valueBuilder({ value, row, key }) {
            if (value != null) {
              row[key] = moment(value);
            }
          },
          valueResolve({ value, row, key }) {
            if (value != null) {
              row[key] = value.unix();
            }
          }
        },
        datetime: {
          title: "日期时间",
          type: "datetime",
          valueBuilder({ value, row, key }) {
            if (value != null) {
              row[key] = moment(value);
            }
          }
        },
        format: {
          title: "格式化",
          type: "datetime",
          form: {
            component: {
              format: "YYYY年MM月DD日 HH:mm",
              valueFormat: "YYYY年MM月DD日 HH:mm"
            }
          },
          column: {
            width: 180,
            component: {
              // 行展示组件使用的dayjs，
              format: "YYYY年MM月DD日 HH:mm"
            }
          }
        },
        date: {
          title: "仅日期",
          type: "date",
          form: {
            component: {
              events: {
                onChange(context) {
                  console.log("change", context);
                }
              }
            }
          },
          valueBuilder({ value, row, key }) {
            if (value != null) {
              row[key] = moment(value);
            }
          }
        },
        disabledDate: {
          title: "禁用日期",
          type: "date",
          form: {
            valueBuilder({ value, row, key }) {
              if (value) {
                row[key] = moment(value);
              }
            },
            component: {
              "picker-options": {
                disabledDate(time) {
                  return time.getTime() < Date.now();
                }
              }
            }
          }
        },
        time: {
          title: "仅时间",
          type: "time",
          form: {
            valueBuilder({ value, row, key }) {
              if (value) {
                row[key] = moment(value);
              }
            },
            valueResolve({ value }) {
              console.log("resolve:", value);
            }
          }
        },
        daterange: {
          title: "日期范围",
          type: "daterange",
          search: { show: true, width: 300 },
          valueBuilder({ row, key }) {
            if (!utils.strings.hasEmpty(row.daterangeStart, row.daterangeEnd)) {
              row[key] = [moment(row.daterangeStart), moment(row.daterangeEnd)];
            }
          }
        },
        datetimerange: {
          title: "日期时间范围",
          type: "datetimerange",
          valueBuilder({ row, key }) {
            if (!utils.strings.hasEmpty(row.datetimerangeStart, row.datetimerangeEnd)) {
              row[key] = [moment(row.datetimerangeStart), moment(row.datetimerangeEnd)];
            }
          },
          valueResolve({ form, key }) {
            const row = form;
            if (row[key] != null && !utils.strings.hasEmpty(row[key])) {
              row.datetimerangeStart = row[key][0];
              row.datetimerangeEnd = row[key][1];
            } else {
              row.datetimerangeStart = null;
              row.datetimerangeEnd = null;
            }
          }
        }
      }
    }
  };
}
