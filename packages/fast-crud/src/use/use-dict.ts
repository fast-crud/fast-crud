import { ref, watch, getCurrentInstance, computed } from "vue";
export function useDict(props, ctx, vModel = "modelValue") {
  const computedOptions = computed(() => {
    if (props.options) {
      return props.options;
    }
    if (props.dict?.data) {
      return props.dict.data;
    }
    return [];
  });

  // @ts-ignore
  const { proxy } = getCurrentInstance();
  const loadDict = async (reload = false) => {
    if (!props.dict) {
      return;
    }
    const scope = {
      dict: props.dict,
      ...props.scope,
      ...ctx.attrs.scope,
      componentRef: proxy,
    };
    if (reload) {
      await props.dict.reloadDict(scope);
      return;
    }
    await props.dict.loadDict(scope);
  };
  loadDict();

  const reloadDict = async () => {
    await loadDict(true);
  };

  return {
    computedOptions,
    loadDict,
    reloadDict,
  };
}
