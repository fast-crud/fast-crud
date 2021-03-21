import { computed } from "vue";
export default (props, ctx) => {
  if (props.dict && props.dict.data == null) {
    props.dict.loadDict();
  }

  const computedOptions = computed(() => {
    if (props.options) {
      return props.options;
    }
    if (props.dict?.data) {
      return props.dict.data;
    }
    return [];
  });

  return {
    computedOptions,
  };
};
