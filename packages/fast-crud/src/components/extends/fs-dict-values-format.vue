<template>
  <span class="fs-values-format">
    <template v-if="type === 'text'">
      <span v-for="item in _items" :key="item[dict.value]">{{
        item[dict.label]
      }}</span>
    </template>
    <template v-else>
      <component
        :is="$fsui.tag.name"
        class="fs-tag"
        v-for="item in _items"
        v-bind="item"
        :key="item[dict.value]"
        size="small"
        :[$fsui.tag.type]="item[dict.color] || 'default'"
        @click="onClick(item)"
        :effect="item.effect"
      >
        {{ item[dict.label] }}
      </component>
    </template>
  </span>
</template>

<script>
import { watch, toRefs } from "vue";
import { useDict } from "../../use/use-dict";
import { uiContext } from "../../ui";
import { defaultDict } from "../../core/dict";
import { cloneDeep } from "lodash-es";
// value格式化展示组件
export default {
  name: "FsValuesFormat",
  props: {
    // 值
    modelValue: {
      require: false,
    },
    // 是否多选
    multiple: { default: true, require: false },
    // value的分隔符<br/>
    // 多选时，如果value为string，则以该分隔符分割成多个展示<br/>
    // 传入空字符串，表示不分割<br/>
    separator: { default: ",", require: false },
    // 数据字典
    dict: {
      type: Object,
    },
    // 颜色，【auto, primary, success, warning, danger ,info】
    // 配置auto，则自动根据value值hashcode分配颜色值
    color: {
      require: false,
    },
    effect: {
      require: false,
    },

    // 自动颜色列表，【 primary, success, warning, danger 】
    autoColors: {
      type: Array,
    },
    // 自动主题列表，【 light, plain 】
    autoEffects: {
      type: Array,
    },
    // 展示类型【text, tag】
    type: {
      default: "tag", // 可选【text,tag】
    },
  },
  emits: ["click"],
  setup(props, ctx) {
    const usedDict = useDict(props, ctx);
    const ui = uiContext.get();
    const COLOR_LIST = ui.tag.colors;
    const EFFECT_LIST = ["plain", "light"];
    usedDict.watchValue(() => {
      return props.modelValue;
    });
    return {
      ...usedDict,
      COLOR_LIST,
      EFFECT_LIST,
    };
  },
  computed: {
    _items() {
      if (this.modelValue == null || this.modelValue === "") {
        return [];
      }
      if (this.dictLoading === true) {
        return [];
      }
      const dictDataMap = this.dictMap;
      const valueArr = this.getValueArr();
      const options = [];
      const dictOpts = this.dict;
      // 没有字典，直接显示值
      if (dictDataMap == null || Object.keys(dictDataMap).length === 0) {
        for (const str of valueArr) {
          const item = {};
          item[dictOpts.value] = str;
          item[dictOpts.label] = str;
          this.setColor(item, dictOpts);
          options.push(item);
        }
        return options;
      }
      // 根据字典展示
      for (const str of valueArr) {
        let item = dictDataMap[str];
        if (item != null) {
          this.setColor(item, dictOpts);
          options.push(item);
        } else {
          item = {};
          item[dictOpts.value] = str;
          item[dictOpts.label] = str;
          this.setColor(item, dictOpts);
          options.push(item);
        }
      }
      return options;
    },
  },
  methods: {
    getValueArr() {
      let valueArr = [];
      if (
        typeof this.modelValue === "string" &&
        this.multiple &&
        this.separator != null &&
        this.separator !== ""
      ) {
        valueArr = this.modelValue.split(this.separator);
      } else if (this.modelValue instanceof Array) {
        // 本来就是数组的
        valueArr = this.modelValue;
      } else {
        valueArr = [this.modelValue];
      }
      return valueArr;
    },
    onClick(item) {
      this.$emit("click", { item: item });
    },
    setColor(item, dict) {
      if (!item.effect && this.effect) {
        item.effect = this.effect;
      }
      if (item[dict.color] != null) {
        return;
      }
      if (this.color === "auto") {
        const hashcode = this.hashcode(item[dict.value]);
        const colors = this.autoColors ? this.autoColors : this.COLOR_LIST;
        item[dict.color] = colors[hashcode % colors.length];
        const effects = this.autoEffects ? this.autoEffects : this.EFFECT_LIST;
        item.effect =
          effects[Math.floor(hashcode / colors.length) % effects.length];
      } else {
        item[dict.color] = this.color;
      }
    },
    hashcode(str) {
      if (str == null) {
        return 0;
      }
      if (typeof str !== "string") {
        str = JSON.stringify(str);
      }
      let hash = 0;
      let i;
      let chr;
      let len;
      if (str.length === 0) return hash;
      for (i = 0, len = str.length; i < len; i++) {
        chr = str.charCodeAt(i);
        hash = (hash << 5) - hash + chr;
        hash |= 0; // Convert to 32bit integer
      }
      return hash;
    },
  },
};
</script>
<style>
.fs-values-format .fs-tag {
  margin: 2px;
}
</style>
