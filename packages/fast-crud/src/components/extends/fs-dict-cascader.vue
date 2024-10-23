<template>
  <component
    :is="ui.cascader.name"
    ref="cascaderRef"
    :options="computedOptions"
    v-bind="fieldNamesBinder"
    @change="onSelectChange"
  />
</template>
<script lang="ts">
import { useDict } from "../../use/use-dict";
import { useUi } from "../../use";
import { defineComponent, ref } from "vue";
/**
 * 字典级联组件
 * 支持el-cascader|a-cascader组件的参数
 */
export default defineComponent({
  name: "FsDictCascader",
  props: {
    /**
     * 字典配置
     */
    dict: {},
    /**
     * 选项，比dict.data优先级高
     */
    options: { type: Array },
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
  setup(props, ctx) {
    const dictUseRet = useDict(props, ctx);
    const { ui } = useUi();
    const fieldNamesBinder = ref();
    // @ts-ignore
    if (props.dict) {
      fieldNamesBinder.value = ui.cascader.fieldNames({
        // @ts-ignore
        value: props.dict.value,
        // @ts-ignore
        label: props.dict.label,
        // @ts-ignore
        children: props.dict.children
      });
    }
    const computedOptions = dictUseRet.createComputedOptions();

    function onSelectChange(value: any) {
      ctx.emit("change", value);
      if (value) {
        let selectedOptions = [];
        const dict = dictUseRet.getDict();
        if (dict && dict.dataMap) {
          for (let item of value) {
            const opt = dict.dataMap[item];
            if (opt) {
              selectedOptions.push(opt);
            }
          }
          ctx.emit("selected-change", selectedOptions);
        }
      } else {
        ctx.emit("selected-change", null);
      }
    }
    return {
      ui,
      ...dictUseRet,
      fieldNamesBinder,
      computedOptions,
      onSelectChange
    };
  }
});
</script>
