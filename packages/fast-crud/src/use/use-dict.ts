import { ref, watch, getCurrentInstance } from "vue";
import { getDictData } from "../core/dict";
export function useDict(props, ctx) {
  const dictData = ref([]);
  const dictMap = ref({});
  const dictLoading = ref(false);

  // @ts-ignore
  const { proxy } = getCurrentInstance();
  const loadDict = async () => {
    if (props.dict) {
      dictLoading.value = true;
      try {
        const ret = await getDictData({
          dict: props.dict,
          scope: ctx.attrs.scope,
          componentRef: proxy,
        });
        dictData.value = ret.data;
        dictMap.value = ret.dataMap;
      } finally {
        dictLoading.value = false;
      }
    }
  };

  loadDict();

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
