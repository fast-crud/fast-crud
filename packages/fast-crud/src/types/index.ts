import logger from "../utils/util.log";
import { forEach } from "lodash-es";
// @ts-ignore
const typeList = import.meta.glob("./list/*.ts", { eager: true });
const defaultTypeCreators: Array<any> = [];
forEach(typeList, (value: any) => {
  defaultTypeCreators.push(value.default);
});

const defaultTypes: any = {};

function getTypes() {
  return defaultTypes;
}

function getType(key: string) {
  return defaultTypes[key];
}

function addTypes(newTypes: any) {
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
      forEach(creator(), (item, key) => {
        defaultTypes[key] = item;
      });
    }
    logger.debug("types installed:", defaultTypes);
  }
};
