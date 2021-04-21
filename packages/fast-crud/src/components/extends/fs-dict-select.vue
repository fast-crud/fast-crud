<template>
  <component :is="$fsui.select.name" :placeholder="computedPlaceholder">
    <template v-for="item of computedOptions" :key="getValue(item)">
      <component :is="$fsui.option.name" v-bind="item" :value="getValue(item)" :label="getLabel(item)">
        {{ getLabel(item) }}
      </component>
    </template>
  </component>
</template>
<script>
import { computed } from "vue";
import { useDict } from "../../use/use-dict";
import { useI18n } from "../../local";

/**
 * 字典选择框
 * 支持el-select|a-select的属性配置
 */
export default {
  name: "FsDictSelect",
  props: {
    /**
     * 字典
     */
    dict: {},
    /**
     * 可选项，比dict.data优先级高
     */
    options: { type: Array },
    /**
     * placeholder
     */
    placeholder: { type: String }
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
      ...useDict(props, ctx)
    };
  }
};
</script>
