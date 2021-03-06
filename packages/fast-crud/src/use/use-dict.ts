import { ref, watch, getCurrentInstance } from "vue";
import { getDictData } from "../core/dict";
export function useDict(props, ctx) {
  const dictData = ref([]);
  const dictMap = ref({});
  const dictLoading = ref(false);

  async function getNodes() {
    const data = await props.dict.getNodes(props.modelValue);
    const dataMap = {};
    for (const item of data) {
      dataMap[item[props.dict.value]] = item;
    }
    dictData.value = data;
    dictMap.value = dataMap;
  }

  function registerWatchValue() {
    watch(
      () => {
        return props.modelValue;
      },
      async () => {
        await loadDict();
      }
    );
  }

  // @ts-ignore
  const { proxy } = getCurrentInstance();
  const loadDict = async () => {
    if (!props.dict) {
      return;
    }
    if (props.dict.getNodes) {
      getNodes();
      return;
    }
    dictLoading.value = true;
    try {
      const ret = await getDictData({
        dict: props.dict,
        ...props.scope,
        ...ctx.attrs.scope,
        componentRef: proxy,
      });
      dictData.value = ret.data;
      dictMap.value = ret.dataMap;
    } finally {
      dictLoading.value = false;
    }
  };
  loadDict();
  if (props.dict.getNodes) {
    registerWatchValue();
  }

  if (props.dict && props.dict.data) {
    watch(
      () => {
        return props.dict.data;
      },
      () => {
        loadDict();
      }
    );
  }

  const clearDict = () => {
    dictData.value = [];
    dictMap.value = {};
  };

  const reloadDict = async () => {
    clearDict();
    await loadDict();
  };

  return {
    dictData,
    dictMap,
    loadDict,
    reloadDict,
    clearDict,
    dictLoading,
  };
}
