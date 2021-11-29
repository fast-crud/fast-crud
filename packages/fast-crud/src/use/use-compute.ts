import _ from "lodash-es";
import { computed, ref, toRaw, watch, isRef } from "vue";
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
      // @ts-ignore
      const path: string = context.path;
      if (excludes) {
        for (const exclude of excludes) {
          if (typeof exclude === "string") {
            if (path.startsWith(exclude)) {
              return false;
            }
          } else if (exclude instanceof RegExp) {
            if (exclude.test(path)) {
              return true;
            }
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
  //console.assert(target != null, "doComputed:targetRef 不能为空");
  if (target == null) {
    return computed(() => {
      if (userComputedFn) {
        return userComputedFn(null);
      }
      return null;
    });
  }
  if (target instanceof Function) {
    target = target();
  }

  if (!isRef(target)) {
    target = ref(target);
  }
  const raw = toRaw(target.value);
  const dependValues = findComputeValues(raw, excludes, false);

  const dependAsyncValues = findComputeValues(raw, excludes, true);
  const asyncCount = Object.keys(dependAsyncValues).length;
  const syncCount = Object.keys(dependValues).length;
  const asyncValuesMap = doAsyncCompute(dependAsyncValues, getContextFn);

  return computed(() => {
    let targetValue = target.value;
    if (asyncCount > 0 || syncCount > 0) {
      targetValue = cloneDeep(targetValue);
      if (syncCount > 0) {
        _.forEach(dependValues, (value, key) => {
          const context = getContextFn ? getContextFn(key, value) : {};
          _.set(targetValue, key, value.computeFn(context));
        });
      }
      if (asyncCount > 0) {
        setAsyncComputeValue(targetValue, asyncValuesMap);
      }
    }

    if (userComputedFn) {
      return userComputedFn(targetValue);
    }
    return targetValue;
  });
}

export class ComputeValue {
  computeFn;
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
  watch;
  asyncFn;
  defaultValue?;
  constructor({ watch, asyncFn, defaultValue }: { watch; asyncFn; defaultValue? }) {
    this.watch = watch;
    this.asyncFn = asyncFn;
    this.defaultValue = defaultValue;
  }

  buildAsyncRef(getContextFn) {
    getContextFn = getContextFn || function () {};
    const asyncRef = ref(this.defaultValue);
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
        console.log("asyncRef.value,get->", asyncRef.value);
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
    doComputed
  };
}
