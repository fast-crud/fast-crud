import * as api from "./api";
import { utils } from "/src/fs";
import moment from "moment";
export default function({ crudRef }) {
  const pageRequest = async query => {
    return await api.GetList(query);
  };
  const editRequest = async ({ form, row }) => {
    form.id = row.id;
    return await api.UpdateObj(form);
  };
  const delRequest = async id => {
    return await api.DelObj(id);
  };

  const addRequest = async ({ form }) => {
    return await api.AddObj(form);
  };
  return {
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
        valueBuilder({ row, key }) {
          const value = row[key];
          if (value != null) {
            row[key] = moment(value);
          }
        }
      },
      datetime: {
        title: "日期时间",
        type: "datetime",
        valueBuilder({ row, key }) {
          const value = row[key];
          if (value != null) {
            row[key] = moment(value);
          }
        },
        valueResolve({ form, key }) {
          const value = form[key];
          if (value != null) {
            form[key] = value.format();
          }
        }
      },
      format: {
        title: "格式化",
        type: "datetime",
        form: {
          transformValue(value) {
            console.log("transform", value);
            return moment(value);
          },
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
        type: "date"
      },
      disabledDate: {
        title: "禁用日期",
        type: "date",
        form: {
          transformValue(value) {
            console.log("transform", value);
            return moment(value);
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
          transformValue(value) {
            console.log("transform", value);
            return moment(value);
          }
        }
      },
      daterange: {
        title: "日期范围",
        type: "daterange",
        search: { show: true, width: 300 },
        form: {
          component: {
            "time-arrow-control": false
            //"picker-options": { shortcuts: shortcuts }
          }
        }
        // valueBuilder(row, key) {
        //   // if (!StringUtils.hasEmpty(row.daterangeStart, row.daterangeEnd)) {
        //   //   row.daterange = [
        //   //     new Date(row.daterangeStart),
        //   //     new Date(row.daterangeEnd)
        //   //   ];
        //   // }
        // },
        // valueResolve(row, key) {
        //   // if (row.daterange != null && row.daterange.length > 1) {
        //   //   row.daterangeStart = row.daterange[0].getTime();
        //   //   row.daterangeEnd = row.daterange[1].getTime();
        //   // } else {
        //   //   row.daterangeStart = null;
        //   //   row.daterangeEnd = null;
        //   // }
        // }
      },
      datetimerange: {
        title: "日期时间范围",
        type: "datetimerange",
        form: {
          component: {
            "time-arrow-control": true,
            "default-time": ["12:00:00", "12:00:00"]
            //"picker-options": { shortcuts: shortcuts }
          }
        }
        // valueBuilder(row, key) {
        //   if (
        //     !utils.string.hasEmpty(row.datetimerangeStart, row.datetimerangeEnd)
        //   ) {
        //     row.datetimerange = [
        //       new Date(row.datetimerangeStart),
        //       new Date(row.datetimerangeEnd)
        //     ];
        //   }
        // },
        // valueResolve(row, key) {
        //   if (
        //     row.datetimerange != null &&
        //     !utils.string.hasEmpty(row.datetimerange)
        //   ) {
        //     row.datetimerangeStart = row.datetimerange[0].getTime();
        //     row.datetimerangeEnd = row.datetimerange[1].getTime();
        //   } else {
        //     row.datetimerangeStart = null;
        //     row.datetimerangeEnd = null;
        //   }
        // }
      }
    }
  };
}
