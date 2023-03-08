<template>
  <div class="fs-tabs-filter">
    <component :is="ui.tabs.name" v-bind="binding">
      <component
        :is="ui.tabPane.name"
        v-if="defaultOption.show"
        :[ui.tabPane.key]="__DEFAULT__"
        :[ui.tabPane.tab]="defaultOption.label"
      />
      <component
        :is="ui.tabPane.name"
        v-for="item of options"
        :[ui.tabPane.key]="getValue(item)"
        :[ui.tabPane.tab]="getLabel(item)"
      />
    </component>
  </div>
</template>
<script lang="ts" setup>
import { computed, useAttrs } from "vue";
import _ from "lodash-es";
import { useUi } from "../../use";
defineOptions({
  name: "FsTabsFilter",
  inheritAttrs: false
});

type TabsFilterDefaultOption = { show?: boolean; value?: any; label?: string };
type TabsFilterOption = { value: any; label: string; [key: string]: any };
interface TabsFilterProps {
  name: string; //查询字段的key,search参数key
  show?: boolean;
  defaultOption?: TabsFilterDefaultOption;
  options: TabsFilterOption[];
  modelValue: any;
  value?: string;
  label?: string;
}

const attrs = useAttrs();

const props = withDefaults(defineProps<TabsFilterProps>(), {
  show: false,
  value: "value",
  label: "label",
  defaultOption: undefined,
  options: () => {
    return [];
  }
});

const defaultOption = computed(() => {
  const def = {
    show: true,
    value: null,
    label: "全部"
  } as TabsFilterDefaultOption;
  return _.merge(def, props.defaultOption || {});
});

const __DEFAULT__ = "_default_";
const binding = computed(() => {
  const value = props.modelValue || __DEFAULT__;
  return {
    type: "card",
    ...attrs,
    [ui.tabs.modelValue]: value,
    ["onUpdate:" + ui.tabs.modelValue]: onUpdateActiveKey
  };
});

const emit = defineEmits(["update:modelValue", "change"]);

function onUpdateActiveKey(value: any) {
  console.log("value", value);
  if (__DEFAULT__ === value) {
    value = defaultOption.value.value;
  }
  emit("update:modelValue", value);
  emit("change", value);
}

function getValue(option: TabsFilterOption) {
  return option[props.value];
}
function getLabel(option: TabsFilterOption) {
  return option[props.label];
}

const { ui } = useUi();
</script>

<style lang="less">
.fs-tabs-filter {
  margin: 0;
  width: 100%;
  //width: 100%;
  .ant-tabs > .ant-tabs-nav,
  .ant-tabs > div > .ant-tabs-nav {
    margin-bottom: 0;
  }

  .el-tabs--card > .el-tabs__header {
    margin-bottom: 0;
  }

  .n-tab-pane {
    padding: 0;
  }
}
</style>
