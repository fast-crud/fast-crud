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
    renderLabel: {
      type: Function
    }
  },
  emits: ["dict-change"],
  // render () {
  //   return this.renderFunc({ data: this.data, dataMap: this.dataMap, scope: this.scope, attrs: this.$attrs })
  // },
  setup(props, ctx) {
    const { t } = useI18n();
    const computedPlaceholder = computed(() => {
      return props.placeholder || t("fs.component.select.placeholder");
    });

    const { ui } = useUi();
    const usedDict = useDict(props, ctx, ui.select.modelValue);
    const computedOptions = usedDict.createComputedOptions();
    return {
      computedPlaceholder,
      ...usedDict,
      computedOptions
    };
  },
  render() {
    const { ui } = useUi();
    const selectComp = resolveDynamicComponent(ui.select.name);
    if (ui.option.name == null) {
      //naive ui
      //以options参数作为options
      const options = this.computedOptions || [];
      return <selectComp placeholder={this.computedPlaceholder} options={options} renderLabel={this.renderLabel} />;
    }
    // options 为子组件
    const options = [];
    const optionComp = resolveDynamicComponent(ui.option.name);
    for (const item of this.computedOptions) {
      const option = (
        <optionComp {...item} value={this.getValue(item)} label={this.getLabel(item)}>
          {this.renderLabel ? this.renderLabel(item) : this.getLabel(item)}
        </optionComp>
      );
      options.push(option);
    }
    return (
      <selectComp placeholder={this.computedPlaceholder} v-slots={this.slots}>
        {options}
      </selectComp>
    );
  }
});
