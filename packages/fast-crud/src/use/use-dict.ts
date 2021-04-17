import { getCurrentInstance, computed, reactive, watch, inject } from "vue";
import _ from "lodash-es";
export function useDict(props, ctx, vModel = "modelValue") {
  let dict = props.dict;
  if (dict) {
    if (dict.prototype) {
      dict.clear();
      dict = reactive(_.cloneDeep(props.dict));
    }
  }

  const computedOptions = computed(() => {
    if (props.options) {
      return props.options;
    }
    if (dict && dict.data != null) {
      return dict.data;
    }
    return [];
  });

  function getDict() {
    return dict;
  }
  const getScope: Function = inject("get:scope") || function () {};
  // @ts-ignore
  const { proxy } = getCurrentInstance();
  const loadDict = async (reload = false) => {
    if (!dict) {
      return;
    }
    if (dict.loading) {
      return;
    }
    const value = props[vModel];

    const scope = {
      ...getScope(),
      componentRef: proxy,
      value
    };
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

  const watchValue = () => {
    watch(
      () => {
        return props[vModel];
      },
      () => {
        reloadDict();
      }
    );
  };

  const getDictData = () => {
    return getDict()?.data;
  };

  const getPropValue = (item, prop) => {
    let attr = prop;
    if (getDict()) {
      attr = getDict()[prop];
    }
    return item[attr];
  };
  const getValue = (item) => {
    return getPropValue(item, "value");
  };

  const getChildren = (item) => {
    return getPropValue(item, "children");
  };
  const getLabel = (item) => {
    return getPropValue(item, "label");
  };
  const getColor = (item) => {
    return getPropValue(item, "color");
  };

  return {
    computedOptions,
    loadDict,
    reloadDict,
    getDictData,
    getDict,
    watchValue,
    getValue,
    getLabel,
    getChildren,
    getColor
  };
}
