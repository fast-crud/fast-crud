import { computed, defineComponent, resolveDynamicComponent } from "vue";
import { useDict } from "../../use/use-dict";
import { useI18n } from "../../locale";
import { useUi } from "../../use";

/**
 * 字典选择框
 * 支持el-select|a-select的属性配置
 */
export default defineComponent({
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
    placeholder: { type: String },
    /**
     * select组件的插槽
     */
    slots: {},

    /**
     * 自定义label的render方法
     */
    renderLabel: {
      type: Function
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
     * 字典项变化
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
    const { t } = useI18n();
    const computedPlaceholder = computed(() => {
      return props.placeholder || t("fs.component.select.placeholder");
    });

    const { ui } = useUi();
    const usedDict = useDict(props, ctx, ui.select.modelValue);
    const computedOptions = usedDict.createComputedOptions();

    const onSelectedChange = (value: any) => {
      ctx.emit("change", value);
      const dict = usedDict.getDict();
      //如果是数组
      if (value && Array.isArray(value) && value.length > 0) {
        const opts = [];
        for (const v of value) {
          if (dict && dict.dataMap && dict.dataMap[v]) {
            opts.push(dict.dataMap[v]);
          }
        }
        ctx.emit("selected-change", opts);
        return;
      }

      if (dict && dict.dataMap && dict.dataMap[value]) {
        const opt = dict.dataMap[value];
        ctx.emit("selected-change", opt);
      } else {
        ctx.emit("selected-change", null);
      }
    };
    return {
      computedPlaceholder,
      ...usedDict,
      computedOptions,
      onSelectedChange
    };
  },
  render() {
    const { ui } = useUi();
    const selectComp = resolveDynamicComponent(ui.select.name);
    const vModel = ui.select.modelValue;
    if (ui.option.name == null) {
      //naive ui
      //以options参数作为options
      const options = this.computedOptions || [];
      const binding: any = {
        [`onUpdate:${vModel}`]: (value:any) => {
          //@ts-ignore
          this.$emit(`onUpdate:${vModel}`, value);
          this.onSelectedChange(value);
        }
      };
      return (
        <selectComp
          ref={"selectRef"}
          placeholder={this.computedPlaceholder}
          options={options}
          renderLabel={this.renderLabel}
          {...binding}
        />
      );
    }
    // options 为子组件
    const options = [];
    const optionComp = resolveDynamicComponent(ui.option.name);
    const computedOptions = this.computedOptions || [];
    for (const item of computedOptions) {
      const option = (
        <optionComp {...item} value={this.getValue(item)} label={this.getLabel(item)}>
          {this.renderLabel ? this.renderLabel(item) : this.getLabel(item)}
        </optionComp>
      );
      options.push(option);
    }
    return (
      <selectComp
        ref={"selectRef"}
        placeholder={this.computedPlaceholder}
        v-slots={this.slots}
        onChange={this.onSelectedChange}
      >
        {options}
      </selectComp>
    );
  }
});
