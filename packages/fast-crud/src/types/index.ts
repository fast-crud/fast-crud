import date from "./list/date";
import select from "./list/select";
import cascade from "./list/cascade";
import phone from "./list/phone";
import el from "./list/el";
import text from "./list/text";

import _ from "lodash-es";
/**
 * 根据type获取column的默认配置
 * @type
 */
const defaultTypeCreators = [date, select, cascade, phone, el, text];
const defaultTypes = {};
export default {
  defaultTypes,
  install() {
    for (const creator of defaultTypeCreators) {
      const ret = creator();
      _.forEach(creator(), (item, key) => {
        defaultTypes[key] = item;
      });
    }
  },
};
