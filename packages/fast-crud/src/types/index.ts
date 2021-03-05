import _ from "lodash-es";

// @ts-ignore
const typeList = import.meta.globEager("./list/*.ts");
const defaultTypeCreators: Array<any> = [];
_.forEach(typeList, (value: any) => {
  defaultTypeCreators.push(value.default);
});

const defaultTypes = {};
export default {
  defaultTypes,
  install() {
    for (const creator of defaultTypeCreators) {
      _.forEach(creator(), (item, key) => {
        defaultTypes[key] = item;
      });
    }
  },
};
