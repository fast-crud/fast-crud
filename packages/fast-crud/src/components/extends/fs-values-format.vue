<template>
  <span class="fs-values-format">
    <template v-if="type === 'text'">
      <span v-for="item in computedValueItems" :key="getValue(item)" @click="doClick(item)">{{ getLabel(item) }}</span>
    </template>
    <template v-else>
      <component
        :is="$fsui.tag.name"
        v-for="item in computedValueItems"
        v-bind="item"
        :key="getValue(item)"
        class="fs-tag"
        size="small"
        :[$fsui.tag.type]="getColor(item) || 'default'"
        :effect="item.effect"
        @click="doClick(item)"
      >
        {{ item.label }}
      </component>
    </template>
  </span>
</template>

<script>
import { uiContext } from "../../ui";
import _ from "lodash-es";
import { computed } from "vue";
import { useDict } from "../../use/use-dict";
function getHashCode(str) {
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
}

function buildArrayValue(props) {
  let valueArr = [];
  if (typeof props.modelValue === "string" && props.multiple && props.separator != null && props.separator !== "") {
    valueArr = props.modelValue.split(props.separator);
  } else if (props.modelValue instanceof Array) {
    // 本来就是数组的
    valueArr = props.modelValue;
  } else {
    valueArr = [props.modelValue];
  }
  return valueArr;
}

// value格式化展示组件
export default {
  name: "FsValuesFormat",
  props: {
    // 值
    modelValue: {
      require: false
    },
    dict: {},
    // 是否多选
    multiple: { default: true, require: false },
    // value的分隔符<br/>
    // 多选时，如果value为string，则以该分隔符分割成多个展示<br/>
    // 传入空字符串，表示不分割<br/>
    separator: { default: ",", require: false },
    // 颜色，【auto, primary, success, warning, danger ,info】
    // 配置auto，则自动根据value值hashcode分配颜色值
    color: {
      require: false
    },
    effect: {
      require: false
    },

    // 自动颜色列表，【 primary, success, warning, danger 】
    autoColors: {
      type: Array
    },
    // 自动主题列表，【 light, plain 】
    autoEffects: {
      type: Array
    },
    // 展示类型【text, tag】
    type: {
      default: "tag" // 可选【text,tag】
    }
  },
  emits: ["click"],
  setup(props, ctx) {
    //const dict = useDict(props, ctx);
    const ui = uiContext.get();
    const COLOR_LIST = ui.tag.colors;
    const EFFECT_LIST = ["plain", "light"];

    const usedDict = useDict(props, ctx);
    const { getColor, getValue } = usedDict;
    usedDict.watchValue(() => {
      return props.modelValue;
    });
    function setColor(props, item) {
      if (!item.effect && props.effect) {
        item.effect = props.effect;
      }
      if (getColor(item) != null) {
        return;
      }
      const colorProp = props.dict?.color || "color";
      if (props.color === "auto") {
        const hashcode = getHashCode(getValue(item));
        const colors = props.autoColors ? props.autoColors : COLOR_LIST;
        item[colorProp] = colors[hashcode % colors.length];
        const effects = props.autoEffects ? props.autoEffects : EFFECT_LIST;
        item.effect = effects[Math.floor(hashcode / colors.length) % effects.length];
      } else {
        item[colorProp] = props.color;
      }
    }

    const computedValueItems = computed(() => {
      const dict = usedDict.getDict();
      if (props.modelValue == null || props.modelValue === "") {
        return [];
      }
      const valueArr = buildArrayValue(props);

      let options = [];

      const valueProp = props.dict?.value || "value";
      const labelProp = props.dict?.label || "label";

      if (dict) {
        options = dict.getNodesFromDataMap(valueArr);
      } else {
        options = [];
        _.forEach(valueArr, (item) => {
          if (item instanceof Object) {
            options.push(item);
          } else {
            options.push({
              [valueProp]: item,
              [labelProp]: item
            });
          }
        });
      }

      const colorfulOptions = _.cloneDeep(options);
      _.forEach(colorfulOptions, (item) => {
        setColor(props, item);
      });
      return colorfulOptions;
    });

    function doClick(item) {
      ctx.emit("click", { item: item });
    }

    return {
      ...usedDict,
      doClick,
      computedValueItems
    };
  }
};
</script>
<style>
.fs-values-format .fs-tag {
  margin: 2px;
}
</style>
