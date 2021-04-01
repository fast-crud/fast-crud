import { getCurrentInstance, computed, reactive, watch } from "vue";
import _ from "lodash-es";
export function useDict(props, ctx) {
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
  // @ts-ignore
  const { proxy } = getCurrentInstance();
  const loadDict = async (reload = false) => {
    if (!dict) {
      return;
    }
    if (dict.loading) {
      return;
    }
    const scope = {
      ...props.scope,
      ...ctx.attrs.scope,
      componentRef: proxy,
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

  const watchValue = (value) => {
    watch(value, () => {
      console.log("reload dict", dict);
      reloadDict();
    });
  };

  return {
    computedOptions,
    loadDict,
    reloadDict,
    getDict,
    watchValue,
  };
}
