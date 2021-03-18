import _ from "lodash-es";
import { computed, ref, toRaw, watch } from "vue";
import getEachDeep from "deepdash-es/getEachDeep";

const eachDeep = getEachDeep(_);

function isAsyncCompute(value) {
  return value instanceof AsyncComputeValue;
}
function isSyncCompute(value) {
  return value instanceof ComputeValue;
}
function findComputeValues(target, excludes, isAsync) {
  const foundMap = {};
  const checkFunc = isAsync ? isAsyncCompute : isSyncCompute;
  eachDeep(target, (value, key, parent, context) => {
    if (checkFunc(value)) {
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

function doAsyncCompute(dependAsyncValues, getContextFn) {
  if (dependAsyncValues == null || Object.keys(dependAsyncValues).length <= 0) {
    return null;
  }
  const asyncValueMap = {};
  _.forEach(dependAsyncValues, (item, key) => {
    asyncValueMap[key] = item.buildAsyncRef(getContextFn);
  });
  console.log("asyncComputedValues", asyncValueMap);
  return asyncValueMap;
}

function setAsyncComputeValue(target, asyncValuesMap) {
  console.log("setAsyncComputeValue", target, asyncValuesMap);
  if (asyncValuesMap == null || Object.keys(asyncValuesMap).length <= 0) {
    return;
  }
  _.forEach(asyncValuesMap, (valueRef, key) => {
    console.log("setAsyncComputeValue2", key, valueRef, valueRef.value);
    _.set(target, key, valueRef.value);
  });
}

function doComputed(target, getContextFn, clone = true, excludes, callback) {
  let raw = toRaw(target);
  const dependValues = ComputeValue.findComputeValues(raw, excludes);

  const dependAsyncValues = AsyncComputeValue.findComputeValues(raw, excludes);
  console.log("form async value", dependAsyncValues);
  const asyncValuesMap = doAsyncCompute(dependAsyncValues, getContextFn);

  if (Object.keys(dependValues).length <= 0) {
    // 不需要重新计算
    return computed(() => {
      setAsyncComputeValue(target, asyncValuesMap);
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

    setAsyncComputeValue(target, asyncValuesMap);
    if (callback) {
      return callback(target);
    }
    return target;
  });
}

export class ComputeValue {
  constructor(computeFn) {
    this.computeFn = computeFn;
  }

  static create(computeFn) {
    return new ComputeValue(computeFn);
  }

  static findComputeValues(target, exclude) {
    return findComputeValues(target, exclude, false);
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
}

function compute(computeFn) {
  return ComputeValue.create(computeFn);
}

export class AsyncComputeValue {
  constructor({ watch, asyncFunc }) {
    this.watch = watch;
    this.asyncFunc = asyncFunc;
  }

  static findComputeValues(target, exclude) {
    return findComputeValues(target, exclude, true);
  }

  buildAsyncRef(getContextFn) {
    const asyncRef = ref();
    const computedValue = computed(() => {
      if (this.watch) {
        return this.watch(getContextFn());
      }
      return null;
    });

    watch(
      () => computedValue.value,
      async () => {
        //执行异步方法
        asyncRef.value = await this.asyncFunc(
          computedValue.value,
          getContextFn()
        );
        console.log("watch effect", asyncRef);
      },
      { immediate: true }
    );

    return asyncRef;
  }
}
function asyncCompute({ watch, asyncFunc }) {
  return new AsyncComputeValue({ watch, asyncFunc });
}
export function useCompute() {
  return {
    ComputeValue,
    compute,
    AsyncComputeValue,
    asyncCompute,
    doComputed,
  };
}
