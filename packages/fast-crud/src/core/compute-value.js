import _ from "lodash-es";
import { computed, toRaw } from "vue";
import getEachDeep from "deepdash-es/getEachDeep";
const eachDeep = getEachDeep(_);
export class ComputeValue {
  constructor(computeFn) {
    this.computeFn = computeFn;
  }

  static create(computeFn) {
    return new ComputeValue(computeFn);
  }

  static findComputeValues(target, excludes) {
    const foundMap = {};
    eachDeep(target, (value, key, parent, context) => {
      if (value instanceof ComputeValue) {
        const path = context.path;
        if (excludes) {
          for (const exclude of excludes) {
            if (path.startsWith(exclude)) {
              return false;
            }
          }
        }
        foundMap[path] = value;
        return false;
      }
      return true;
    });

    return foundMap;
  }

  static buildBindProps(target, getContextFn, clone = true) {
    const dependValues = ComputeValue.findComputeValues(target);
    if (Object.keys(dependValues).length > 0) {
      if (clone) {
        target = _.cloneDeep(target);
      }
      _.forEach(dependValues, (value, key) => {
        const context = getContextFn ? getContextFn(key, value) : {};
        _.set(target, key, value.computeFn(context));
      });
    }
    return target;
  }

  static computed(target, getContextFn, clone = true, excludes, callback) {
    const dependValues = ComputeValue.findComputeValues(
      toRaw(target),
      excludes
    );
    if (Object.keys(dependValues).length <= 0) {
      // 不需要重新计算
      return computed(() => {
        if (callback) {
          return callback(target);
        }
        return target;
      });
    }

    return computed(() => {
      if (clone) {
        target = _.cloneDeep(target);
      }
      // console.log('function recomputed', target)
      _.forEach(dependValues, (value, key) => {
        const context = getContextFn ? getContextFn(key, value) : {};
        _.set(target, key, value.computeFn(context));
      });
      if (callback) {
        return callback(target);
      }
      return target;
    });
  }
}

export function compute(computeFn) {
  return ComputeValue.create(computeFn);
}
