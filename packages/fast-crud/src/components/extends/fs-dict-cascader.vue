<template>
  <component
    :is="ui.cascader.name"
    ref="cascaderRef"
    :options="computedOptions"
    v-bind="fieldNamesBinder"
    @change="onSelectChange"
  >
    <template v-for="(value, key) of mergedSlots" :key="key" #[key]="scope">
      <fs-slot-render :slots="value" :scope="scope" />
    </template>
  </component>
</template>
<script lang="ts">
import { useDict } from "../../use/use-dict";
import { useUi } from "../../use";
import { computed, defineComponent, PropType, ref, Slot } from "vue";
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
    },
    /**
     * 级联选择器插槽，模板插槽同名时优先
     */
    slots: {
      type: Object as PropType<Record<string, Slot>>,
      default() {
        return {};
      }
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
    const cascaderRef = ref();
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
    const mergedSlots = computed(() => ({ ...props.slots, ...ctx.slots }));

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
      cascaderRef,
      ...dictUseRet,
      fieldNamesBinder,
      computedOptions,
      mergedSlots,
      onSelectChange
    };
  }
});
</script>
