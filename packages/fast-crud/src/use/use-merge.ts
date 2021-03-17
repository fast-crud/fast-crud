import _ from "lodash-es";
function merge(target, ...sources) {
  function customizer(objValue, srcValue) {
    if (_.isArray(objValue)) {
      return srcValue;
    }
    if (srcValue != null && srcValue instanceof NotMerge) {
      return srcValue;
    }
  }
  return _.mergeWith(target, ...sources, customizer);
}
class NotMerge {}

export function useMerge() {
  return {
    merge,
    NotMerge,
  };
}
