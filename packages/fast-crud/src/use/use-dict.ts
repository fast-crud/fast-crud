import { getCurrentInstance, computed, watch, inject, shallowReactive } from "vue";
import _ from "lodash-es";
import { uiContext } from "../ui";
import { utils } from "../utils";
export function useDict(props: any, ctx: any, vModel = "modelValue") {
  const ui = uiContext.get();
  let dict = props.dict;
  if (dict) {
    if (dict.prototype) {
      dict.clear();
      dict = shallowReactive(_.cloneDeep(props.dict));
    }
  }

  function createComputedOptions() {
    return computed(() => {
      let options: any = [];
      if (props.options) {
        options = props.options;
      } else if (dict && dict.data != null) {
        if (!(dict.data instanceof Array)) {
          utils.logger.warn("dict.data类型错误，期望为数组，实际：" + dict.data);
        }
        options = dict.data;
      }

      if (ui.type === "naive") {
        const newOptions: any = [];
        for (const option of options) {
          newOptions.push({
            ...option,
            value: getValue(option),
            label: getLabel(option)
          });
        }
        return newOptions;
      }
      return options;
    });
  }

  function getDict() {
    return dict;
  }

  const getScope: Function = inject("get:scope", function () {});

  function getCurrentScope() {
    const value = props[vModel] || ctx.attrs[vModel];
    return {
      ...getScope(),
      componentRef: proxy,
      value
    };
  }
  // @ts-ignore
  const { proxy } = getCurrentInstance();
  const loadDict = async (reload = false) => {
    if (!dict) {
      return;
    }
    if (dict.loading) {
      return;
    }

    const scope = getCurrentScope();
    if (reload) {
      await dict.reloadDict(scope);
      return;
    }
    await dict.loadDict(scope);
  };
  loadDict();

  const reloadDict = async () => {
    await loadDict(true);
  };
  const clearDict = () => {
    if (!dict) {
      return;
    }
    dict.clear();
  };

  const watchValue = () => {
    if (dict == null) {
      return;
    }
    if (!dict.prototype && !dict.cloneable) {
      //如果是单例，则不watch
      return;
    }
    //for values-format
    watch(
      () => {
        return props[vModel];
      },
      () => {
        reloadDict();
      }
    );
  };

  const watchDictData = () => {
    watch(
      () => {
        return dict?.data;
      },
      () => {
        const scope = getCurrentScope();
        if (ctx.attrs.onDictChange) {
          // ctx.attrs.onDictChange({ dict, ...scope });
        }
        ctx.emit("dict-change", { dict, ...scope });
      },
      {
        immediate: true
      }
    );
  };
  watchDictData();

  const getDictData = () => {
    return getDict()?.data;
  };

  const getPropValue = (item: any, prop: any) => {
    let attr = prop;
    if (getDict()) {
      attr = getDict()[prop];
    }
    return item[attr];
  };
  const removePropValue = (item: any, prop: any) => {
    let attr = prop;
    if (getDict()) {
      attr = getDict()[prop];
    }
    delete item[attr];
  };
  const getValue = (item: any) => {
    return getPropValue(item, "value");
  };

  const getChildren = (item: any) => {
    return getPropValue(item, "children");
  };
  const getLabel = (item: any) => {
    return getPropValue(item, "label");
  };
  const getColor = (item: any) => {
    return getPropValue(item, "color");
  };

  return {
    createComputedOptions,
    loadDict,
    reloadDict,
    clearDict,
    getDictData,
    getDict,
    watchValue,
    getValue,
    getLabel,
    getChildren,
    getColor,
    removePropValue,
    curDict: dict
  };
}
