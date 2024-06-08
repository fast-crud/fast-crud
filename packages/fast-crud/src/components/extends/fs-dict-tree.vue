<template>
  <component
    :is="ui.treeSelect.name"
    ref="treeRef"
    :[ui.treeSelect.options]="computedOptions"
    :placeholder="computedPlaceholder"
    v-bind="computedBinding"
    @change="onSelectedChange"
  >
    <template v-for="(value, key) of slots" :key="key" #[key]="scope">
      <fs-slot-render :slots="value" :scope="scope"></fs-slot-render>
    </template>
  </component>
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
  components: {},
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
  emits: [
    /**
     * 字典数据变化事件
     */
    "dict-change",

    /**
     * 选中值变化事件，可以获取到当前选中的option对象
     */
    "selected-change",
    /**
     * 值变化事件
     */
    "change"
  ],
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

    const slots = ctx.slots;

    const computedOptions = usedDict.createComputedOptions();

    const computedBinding = computed(() => {
      const dict = usedDict.getDict();
      return ui.treeSelect.buildOptionKeysNameBinding({
        label: dict.label,
        value: dict.value,
        children: dict.children
      });
    });

    const onSelectedChange = (value: any) => {
      ctx.emit("change", value);
      if (value) {
        const dict = usedDict.getDict();
        if (dict && dict.dataMap) {
          if (value instanceof Array) {
            let selectedOptions = [];
            for (let item of value) {
              const opt = dict.dataMap[item];
              if (opt) {
                selectedOptions.push(opt);
              }
            }
            ctx.emit("selected-change", selectedOptions);
          } else {
            ctx.emit("selected-change", dict.dataMap[value]);
          }
        }
      } else {
        ctx.emit("selected-change", null);
      }
    };

    const treeRef = ref();
    return {
      ui,
      computedBinding,
      computedPlaceholder,
      ...usedDict,
      computedOptions,
      onSelectedChange,
      slots,
      treeRef
    };
  }
});
</script>
