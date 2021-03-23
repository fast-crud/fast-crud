import { getCurrentInstance, computed, ref, toRef } from "vue";
import _ from "lodash-es";
export function useDict(props, ctx) {
  let dictRef = ref();
  if (props.dict) {
    if (props.dict.prototype) {
      props.dict.clear();
      dictRef.value = _.cloneDeep(props.dict);
    } else if (!props.dict.cache) {
      props.dict.clear();
      dictRef.value = props.dict;
    } else {
      dictRef = toRef(props, "dict");
    }
  }

  const computedOptions = computed(() => {
    if (props.options) {
      return props.options;
    }
    if (dictRef.value) {
      return dictRef.value.data;
    }
    return [];
  });

  function getDict() {
    return dictRef.value;
  }
  function getDictRef() {
    return dictRef;
  }

  // @ts-ignore
  const { proxy } = getCurrentInstance();
  const loadDict = async (reload = false) => {
    if (!dictRef.value) {
      return;
    }
    const scope = {
      ...props.scope,
      ...ctx.attrs.scope,
      componentRef: proxy,
    };
    if (reload) {
      await dictRef.value.reloadDict(scope);
      return;
    }
    await dictRef.value.loadDict(scope);
  };
  loadDict();

  const reloadDict = async () => {
    await loadDict(true);
  };

  return {
    computedOptions,
    loadDict,
    reloadDict,
    getDict,
    getDictRef,
  };
}
