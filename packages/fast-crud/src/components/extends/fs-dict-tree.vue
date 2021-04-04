<template>
  <component
    :is="$fsui.treeSelect.name"
    :treeData="computedOptions"
    :placeholder="computedPlaceholder"
  />
</template>
<script>
import { computed } from "vue";
import { useDict } from "../../use/use-dict";
import { useI18n } from "../../local";
export default {
  name: "FsDictTree",
  props: {
    dict: {},
    //选项，比dict.data优先级高
    options: { type: Array },
    placeholder: { type: String },
  },
  // render () {
  //   return this.renderFunc({ data: this.data, dataMap: this.dataMap, scope: this.scope, attrs: this.$attrs })
  // },
  setup(props, ctx) {
    const { t } = useI18n();
    const computedPlaceholder = computed(() => {
      return props.placeholder || t("fs.component.select.placeholder");
    });

    return {
      computedPlaceholder,
      ...useDict(props, ctx),
    };
  },
};
</script>
