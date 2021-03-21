import _ from "lodash-es";
import { computed, ref, toRaw, watch } from "vue";
import getEachDeep from "deepdash-es/getEachDeep";
import { useMerge } from "./use-merge";
const { cloneDeep } = useMerge();
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
  return asyncValueMap;
}

function setAsyncComputeValue(target, asyncValuesMap) {
  if (asyncValuesMap == null || Object.keys(asyncValuesMap).length <= 0) {
    return;
  }
  _.forEach(asyncValuesMap, (valueRef, key) => {
    _.set(target, key, valueRef.value == null ? null : valueRef.value);
  });
}

function doComputed(target, getContextFn, excludes, userComputedFn) {
  let raw = toRaw(target);
  const dependValues = findComputeValues(raw, excludes, false);

  const dependAsyncValues = findComputeValues(raw, excludes, true);
  const asyncValuesMap = doAsyncCompute(dependAsyncValues, getContextFn);

  if (Object.keys(dependValues).length <= 0) {
    // 没有同步compute类型的配置
    return computed(() => {
      // 设置异步compute类型的value
      if (asyncValuesMap && Object.keys(asyncValuesMap).length <= 0) {
        target = cloneDeep(target);
        setAsyncComputeValue(target, asyncValuesMap);
      }

      if (userComputedFn) {
        return userComputedFn(target);
      }
      return target;
    });
  }
  // 有同步compute类型的配置
  return computed(() => {
    target = _.cloneDeep(target);
    // console.log('function recomputed', target)
    _.forEach(dependValues, (value, key) => {
      const context = getContextFn ? getContextFn(key, value) : {};
      _.set(target, key, value.computeFn(context));
    });

    setAsyncComputeValue(target, asyncValuesMap);
    if (userComputedFn) {
      return userComputedFn(target);
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
}

function compute(computeFn) {
  return ComputeValue.create(computeFn);
}

export class AsyncComputeValue {
  constructor({ watch, asyncFn }) {
    this.watch = watch;
    this.asyncFn = asyncFn;
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
      async (value) => {
        //执行异步方法
        asyncRef.value = await this.asyncFn(value, getContextFn());
      },
      { immediate: true }
    );

    return asyncRef;
  }
}
function asyncCompute({ watch, asyncFn }) {
  return new AsyncComputeValue({ watch, asyncFn });
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
