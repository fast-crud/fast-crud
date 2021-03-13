import _ from "lodash-es";
import logger from "../utils/util.log";
// @ts-ignore
const typeList = import.meta.globEager("./list/*.ts");
const defaultTypeCreators: Array<any> = [];
_.forEach(typeList, (value: any) => {
  defaultTypeCreators.push(value.default);
});

const defaultTypes = {};

function getTypes() {
  return defaultTypes;
}

function getType(key) {
  return defaultTypes[key];
}

function addTypes(newTypes) {
  for (const key in newTypes) {
    defaultTypes[key] = newTypes[key];
  }
}
export default {
  getType,
  addTypes,
  getTypes,
  install() {
    for (const creator of defaultTypeCreators) {
      _.forEach(creator(), (item, key) => {
        defaultTypes[key] = item;
      });
    }
    logger.debug("types installed:", defaultTypes);
  },
};
