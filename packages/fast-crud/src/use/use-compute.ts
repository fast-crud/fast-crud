import _ from "lodash-es";
import { computed, ref, toRaw, watch, isRef, Ref } from "vue";
import getEachDeep from "deepdash-es/getEachDeep";
import { useMerge } from "./use-merge";
import { ComputeContext } from "/src/d.ts/compute";
import { ComputedRefValue } from "vue/macros";
const { cloneDeep } = useMerge();
// @ts-ignore
const eachDeep = getEachDeep(_);

function isAsyncCompute(value: any) {
  return value instanceof AsyncComputeValue;
}
function isSyncCompute(value: any) {
  return value instanceof ComputeValue;
}
function findComputeValues(target: any, excludes: any[], isAsync: boolean) {
  const foundMap: any = {};
  if (target == null) {
    return foundMap;
  }
  const checkFunc = isAsync ? isAsyncCompute : isSyncCompute;
  eachDeep(
    target,
    (value, key, parent, context) => {
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
    },
    {
      // https://deepdash.io/#eachdeep-foreachdeep
      checkCircular: true
    }
  );

  return foundMap;
}

function doAsyncCompute(dependAsyncValues: any, getContextFn: (key: string, value: any) => any) {
  if (dependAsyncValues == null || Object.keys(dependAsyncValues).length <= 0) {
    return null;
  }
  const asyncValueMap: any = {};
  _.forEach(dependAsyncValues, (item, key) => {
    asyncValueMap[key] = item.buildAsyncRef(getContextFn);
  });
  return asyncValueMap;
}

function setAsyncComputeValue(target: any, asyncValuesMap: any) {
  if (asyncValuesMap == null || Object.keys(asyncValuesMap).length <= 0) {
    return;
  }
  _.forEach(asyncValuesMap, (valueRef, key) => {
    _.set(target, key, valueRef.value == null ? null : valueRef.value);
  });
}

function doComputed(
  getTargetFunc: any,
  getContextFn: (key: string, value: any) => any,
  excludes?: any[],
  userComputedFn?: (target: any) => any
) {
  const dependValues = computed(() => {
    const target = getTargetFunc();
    return findComputeValues(target, excludes, false);
  });

  const dependAsyncValues = computed(() => {
    const target = getTargetFunc();
    return findComputeValues(target, excludes, true);
  });
  //TODO computed
  const asyncValuesMap = doAsyncCompute(dependAsyncValues.value, getContextFn);

  return computed(() => {
    let target = getTargetFunc();
    const asyncCount = Object.keys(dependAsyncValues.value).length;
    const syncCount = Object.keys(dependValues.value).length;

    if (asyncCount > 0 || syncCount > 0) {
      target = cloneDeep(target);
      if (syncCount > 0) {
        _.forEach(dependValues.value, (value, key) => {
          const context = getContextFn ? getContextFn(key, value) : {};
          _.set(target, key, value.computeFn(context));
        });
      }
      if (asyncCount > 0) {
        setAsyncComputeValue(target, asyncValuesMap);
      }
    }

    if (userComputedFn) {
      return userComputedFn(target);
    }
    return target;
  });
}

export type ComputeFn<T> = (context: ComputeContext) => T;
export class ComputeValue<T> {
  computeFn: ComputeFn<T>;
  constructor(computeFn: ComputeFn<T>) {
    this.computeFn = computeFn;
  }

  static create<T>(computeFn: ComputeFn<T>): ComputeValue<T> {
    return new ComputeValue<T>(computeFn);
  }
}

function compute<T>(computeFn: ComputeFn<T>): ComputeValue<T> {
  return ComputeValue.create<T>(computeFn);
}

export type GetContextFn = () => any;

export type AsyncComputeOptions<T> = {
  watch?: (getContextFn: GetContextFn) => any;
  asyncFn: (value: any, getContextFn: GetContextFn) => any;
  defaultValue?: T;
};
export class AsyncComputeValue<T> implements AsyncComputeOptions<T> {
  watch;
  asyncFn;
  defaultValue?: T;
  constructor(options: AsyncComputeOptions<T>) {
    const { watch, asyncFn, defaultValue } = options;
    this.watch = watch;
    this.asyncFn = asyncFn;
    this.defaultValue = defaultValue;
  }

  buildAsyncRef(getContextFn: GetContextFn) {
    getContextFn = getContextFn || function () {};
    const asyncRef = ref<T>(this.defaultValue);
    const computedValue = computed<T>(() => {
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
function asyncCompute<T>(options: AsyncComputeOptions<T>): AsyncComputeValue<T> {
  return new AsyncComputeValue<T>(options);
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
