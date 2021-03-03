import { ref } from "vue";
import { getDictData } from "../core/dict";
export function useDict(props, ctx) {
  const dictData = ref([]);
  const dictMap = ref({});
  const dictLoading = ref(false);
  const loadDict = async () => {
    dictLoading.value = true;
    try {
      const ret = await getDictData(props.dict, { ...ctx.attrs });
      dictData.value = ret.data;
      dictMap.value = ret.dataMap;
    } finally {
      dictLoading.value = false;
    }
  };

  loadDict();

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
