<template>
  <render></render>
</template>
<script lang="tsx" setup>
import { computed, defineComponent, ref, resolveDynamicComponent, useAttrs } from "vue";
import { useDict } from "../../use/use-dict";
import { useI18n } from "../../locale";
import { useUi } from "../../use";

/**
 * 字典选择框
 * 支持el-select|a-select的属性配置
 */

defineOptions({
  name: "FsDictSelect"
});

type PropsType = {
  /**
   * 字典
   */
  dict?: any;
  /**
   * 可选项，比dict.data优先级高
   */
  options?: any[];

  /**
   * select组件的插槽
   */
  slots?: any;

  /**
   * 自定义label的render方法
   */
  renderLabel?: (item: any) => any;
  /**
   * 转换DictData
   */
  transformDictData?: (item: any) => any;
};

const props = defineProps<PropsType>();
const emit = defineEmits(["dict-change", "selected-change", "change"]);

const selectRef = ref();
const { t } = useI18n();
const computedPlaceholder = computed(() => {
  // @ts-ignore
  return props.placeholder || t("fs.component.select.placeholder");
});

const { ui } = useUi();
const attrs = useAttrs();
const ctx = {
  emit,
  attrs
};
const usedDict = useDict(props, ctx, ui.select.modelValue);
const computedOptions = usedDict.createComputedOptions();

const onSelectedChange = (value: any) => {
  emit("change", value);
  const dict = usedDict.getDict();
  //如果是数组
  if (value && Array.isArray(value) && value.length > 0) {
    const opts = [];
    for (const v of value) {
      if (dict && dict.dataMap && dict.dataMap[v]) {
        opts.push(dict.dataMap[v]);
      }
    }
    emit("selected-change", opts);
    return;
  }

  if (dict && dict.dataMap && dict.dataMap[value]) {
    const opt = dict.dataMap[value];
    emit("selected-change", opt);
  } else {
    emit("selected-change", null);
  }
};

const tempSlots = defineSlots();

defineExpose({
  selectRef,
  computedPlaceholder,
  ...usedDict,
  computedOptions,
  onSelectedChange
});

const render = () => {
  const { ui } = useUi();
  const selectComp = resolveDynamicComponent(ui.select.name);
  const vModel = ui.select.modelValue;
  if (ui.option.name == null) {
    //naive ui
    //以options参数作为options
    const options = computedOptions.value || [];
    const binding: any = {
      [`onUpdate:${vModel}`]: (value: any) => {
        //@ts-ignore
        this.$emit(`onUpdate:${vModel}`, value);
        onSelectedChange(value);
      },
      ...attrs
    };
    const thisSlots = {
      ...tempSlots,
      ...props.slots
    };
    return (
      <selectComp
        ref={"selectRef"}
        placeholder={computedPlaceholder.value}
        options={options}
        renderLabel={props.renderLabel}
        v-slots={thisSlots}
        {...binding}
      />
    );
  }
  // options 为子组件
  const options = [];
  const optionComp = resolveDynamicComponent(ui.option.name);
  const cos = computedOptions.value || [];
  for (const item of cos) {
    const option = (
      <optionComp {...item} value={usedDict.getValue(item)} label={usedDict.getLabel(item)}>
        {props.renderLabel ? props.renderLabel(item) : usedDict.getLabel(item)}
      </optionComp>
    );
    options.push(option);
  }
  const thisSlots = {
    default: () => options,
    ...tempSlots,
    ...props.slots
  };
  return (
    <selectComp
      ref={"selectRef"}
      placeholder={computedPlaceholder.value}
      v-slots={thisSlots}
      onChange={onSelectedChange}
      {...attrs}
    />
  );
};
</script>
<style lang="less">
.ant-select-multiple {
  min-width: 100px;
}
</style>
