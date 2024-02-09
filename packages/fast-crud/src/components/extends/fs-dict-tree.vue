<template>
  <component
    :is="ui.treeSelect.name"
    ref="treeRef"
    :[ui.treeSelect.options]="computedOptions"
    :placeholder="computedPlaceholder"
    v-bind="computedBinding"
  />
</template>
<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import { useDict } from "../../use/use-dict";
import { useI18n } from "../../locale";
import { useUi } from "../../use";

/**
 * 字典树选择组件
 * 支持 a-tree-select 参数
 */
export default defineComponent({
  name: "FsDictTree",
  props: {
    /**
     * 数据字典
     */
    dict: {},
    /**
     * 可选项，比dict.data优先级高
     */
    options: { type: Array },
    /**
     * placeholder
     */
    placeholder: { type: String },
    /**
     * 转换DictData
     */
    transformDictData: {
      type: Function,
      default: undefined
    }
  },
  emits: ["dict-change"],
  // render () {
  //   return this.renderFunc({ data: this.data, dataMap: this.dataMap, scope: this.scope, attrs: this.$attrs })
  // },
  setup(props, ctx) {
    const { t } = useI18n();
    const { ui } = useUi();
    const computedPlaceholder = computed(() => {
      return props.placeholder || t("fs.component.select.placeholder");
    });

    let usedDict = useDict(props, ctx);

    const computedOptions = usedDict.createComputedOptions();

    const computedBinding = computed(() => {
      const dict = usedDict.getDict();
      return ui.treeSelect.buildOptionKeysNameBinding({
        label: dict.label,
        value: dict.value,
        children: dict.children
      });
    });
    return {
      ui,
      computedBinding,
      computedPlaceholder,
      ...usedDict,
      computedOptions
    };
  }
});
</script>
