<template>
  <component :is="$fsui.select.name" :placeholder="computedPlaceholder">
    <template v-for="item of dictData" :key="item[dict.value]">
      <component
        :is="$fsui.option.name"
        v-bind="item"
        :[$fsui.option.value]="item[dict.value]"
        :title="item[dict.label]"
        >{{ item[dict.label] }}</component
      >
    </template>
  </component>
</template>
<script>
import { useDict } from "../../use/use-dict";
import { defaultDict } from "../../core/dict";
import { computed } from "vue";
export default {
  name: "FsDictSelect",
  props: {
    dict: {
      default() {
        return defaultDict;
      },
    },
    placeholder: {},
  },
  // render () {
  //   return this.renderFunc({ data: this.data, dataMap: this.dataMap, scope: this.scope, attrs: this.$attrs })
  // },
  setup(props, ctx) {
    const computedPlaceholder = computed(() => {
      return props.placeholder || "请选择";
    });
    return {
      computedPlaceholder,
      ...useDict(props, ctx),
    };
  },
};
</script>
