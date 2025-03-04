import { forEach, set } from "lodash-es";
import { computed, isShallow, ref, Ref, watch } from "vue";
import { useMerge } from "./use-merge";
import { AsyncComputeRef, ComputeFn, ComputeRef, ScopeContext } from "../d";
import { deepdash } from "../utils/deepdash";

const { cloneDeep } = useMerge();

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
  deepdash.forEachDeep(
    target,
    (value: any, key: any, parent: any, context: any) => {
      if (value == null) {
        return false;
      }
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
      //如果是shallow对象，不再往下检索，提升性能，比如dict对象
      if (isShallow(value)) {
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

function doAsyncCompute(dependAsyncValues: any, getContextFn: () => any) {
  if (dependAsyncValues == null || Object.keys(dependAsyncValues).length <= 0) {
    return null;
  }
  const asyncValueMap: any = {};
  forEach(dependAsyncValues, (item, key) => {
    asyncValueMap[key] = item.buildAsyncRef(getContextFn);
  });
  return asyncValueMap;
}

function setAsyncComputeValue(target: any, asyncValuesMap: any) {
  if (asyncValuesMap == null || Object.keys(asyncValuesMap).length <= 0) {
    return;
  }
  forEach(asyncValuesMap, (valueRef, key) => {
    set(target, key, valueRef.value == null ? null : valueRef.value);
  });
}

function doComputed(
  getTargetFunc: any,
  getContextFn: () => any,
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
  //TODO computed之后，运行会死循环， 里面会不断创建watch
  const asyncValuesMap = doAsyncCompute(dependAsyncValues.value, getContextFn);

  return computed(() => {
    let target = getTargetFunc();
    const asyncCount = Object.keys(dependAsyncValues.value).length;
    const syncCount = Object.keys(dependValues.value).length;

    if (asyncCount > 0 || syncCount > 0) {
      target = cloneDeep(target);
      if (syncCount > 0) {
        const context = getContextFn ? getContextFn() : {};
        forEach(dependValues.value, (value, key) => {
          set(target, key, value.computeFn(context));
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

export class ComputeValue<T = any, R = any> implements ComputeRef<T, R> {
  computeFn: ComputeFn<T, R>;
  constructor(computeFn: ComputeFn<T, R>) {
    this.computeFn = computeFn;
  }
}

export function compute<T = any, R = any>(computeFn: ComputeFn<T, R>): ComputeRef<T, R> {
  return new ComputeValue<T, R>(computeFn);
}

export type GetContextFn = () => any;

export class AsyncComputeValue<RV, R = any, WV = any> implements AsyncComputeRef<RV, R> {
  watch?: (context: ScopeContext<R>) => WV;
  asyncFn: (value: WV, getContextFn: GetContextFn) => Promise<RV>;
  defaultValue?: any;
  constructor(options: AsyncComputeRef<RV, R>) {
    const { asyncFn, defaultValue } = options;
    this.watch = options.watch;
    this.asyncFn = asyncFn;
    this.defaultValue = defaultValue;
  }

  buildAsyncRef(getContextFn: GetContextFn) {
    getContextFn = getContextFn || function () {};
    const asyncRef: Ref<RV> = ref(this.defaultValue);
    const computedValue = computed<WV>(() => {
      if (this.watch) {
        return this.watch(getContextFn());
      }
      return null;
    });

    watch(
      () => computedValue.value,
      async (value: WV) => {
        //执行异步方法
        asyncRef.value = await this.asyncFn(value, getContextFn());
      },
      { immediate: true }
    );

    return asyncRef;
  }
}
export function asyncCompute<RV = any, R = any, WV = any>(
  options: AsyncComputeRef<RV, R, WV>
): AsyncComputeRef<RV, R, WV> {
  return new AsyncComputeValue<RV, R, WV>(options);
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
