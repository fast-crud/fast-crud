import _ from "lodash-es";

function merge(target, ...sources) {
  function customizer(objValue, srcValue) {
    if (_.isArray(objValue) && srcValue != null) {
      return srcValue;
    }

    if (srcValue != null && srcValue instanceof UnMergeable) {
      return srcValue;
    }
  }

  let found: any = null;
  for (const item of sources) {
    if (item != null && item instanceof UnMergeable) {
      found = item;
    }
  }
  if (found) {
    return found;
  }
  return _.mergeWith(target, ...sources, customizer);
}
function isUnCloneable(value) {
  return value != null && value instanceof UnMergeable && value.__unCloneable__;
}
function cloneDeep(target) {
  if (isUnCloneable(target)) {
    return target;
  }
  function customizer(value) {
    if (isUnCloneable(value)) {
      return value;
    }
  }

  return _.cloneDeepWith(target, customizer);
}
class UnMergeable {
  __unCloneable__ = true;
  unCloneable() {
    this.__unCloneable__ = true;
  }
  cloneable() {
    this.__unCloneable__ = false;
  }
}

export function useMerge() {
  return {
    merge,
    cloneDeep,
    UnMergeable,
  };
}
