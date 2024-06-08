<template>
  <component :is="ui.radioGroup.name" @change="onSelectedChange">
    <component
      :is="computedRadioName"
      v-for="item of computedOptions"
      ref="radioRef"
      :key="getValue(item)"
      :[ui.radio.value]="getValue(item)"
      v-bind="optionProps"
    >
      {{ getLabel(item) }}
    </component>
  </component>
</template>
<script lang="ts">
import { useDict } from "../../use/use-dict";
import { uiContext } from "../../ui";
import { ref, computed, defineComponent } from "vue";
import { useUi } from "../../use";
/**
 * 字典单选框
 * 支持el-radio-group|a-radio-group的参数
 *
 */
export default defineComponent({
  name: "FsDictRadio",
  props: {
    /**
     * 数据字典配置
     */
    dict: {},
    /**
     * 可选项，比dict.data优先级高
     */
    options: { type: Array },

    /**
     * radio组件名称
     * antdv使用button样式的时候有用
     * 即将废弃,请使用optionName
     */
    radioName: {},

    /**
     * 选项的组件名称
     */
    optionName: {
      type: String
    },

    /**
     * 选项的属性
     */
    optionProps: {
      type: Object,
      default() {
        return {};
      }
    },
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
  setup(props: any, ctx: any) {
    const { ui } = useUi();

    if (props.radioName) {
      console.warn("参数radioName即将废弃，请改成optionName");
    }
    const computedRadioName = computed(() => {
      return props.optionName ?? props.radioName ?? ui.radio.name;
    });

    let usedDict = useDict(props, ctx, ui.radioGroup.modelValue);
    const computedOptions = usedDict.createComputedOptions();

    const onSelectedChange = (value: any) => {
      ctx.emit("change", value);
      if (value && value.target) {
        value = value.target.value;
      }
      const dict = usedDict.getDict();
      if (dict && dict.dataMap && dict.dataMap[value]) {
        const opt = dict.dataMap[value];
        ctx.emit("selected-change", opt);
      } else {
        ctx.emit("selected-change", null);
      }
    };

    return {
      ui,
      computedRadioName,
      ...usedDict,
      computedOptions,
      onSelectedChange
    };
  }
});
</script>
