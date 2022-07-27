import _ from "lodash-es";
import { isRef } from "vue";
function isUnMergeable(srcValue) {
  return srcValue != null && (srcValue instanceof UnMergeable || isRef(srcValue));
}
function isUnCloneable(value) {
  return isUnMergeable(value) && !value.cloneable;
}
function merge(target, ...sources) {
  /**
   * 如果目标为不可合并对象，比如array、unMergeable、ref,则直接覆盖不合并
   * @param objValue 被合并对象
   * @param srcValue 覆盖对象
   */
  function customizer(objValue, srcValue) {
    if (srcValue == null) {
      return;
    }
    // 如果被合并对象为数组，则直接被覆盖对象覆盖，只要覆盖对象不为空
    if (_.isArray(objValue)) {
      return srcValue;
    }

    if (isUnMergeable(srcValue)) {
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
  cloneable = false;

  setCloneable(cloneable) {
    this.cloneable = cloneable;
  }
}

export function useMerge() {
  return {
    merge,
    cloneDeep,
    UnMergeable
  };
}
