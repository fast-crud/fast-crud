<template>
  <span class="fs-values-format">
    <template v-if="type === 'text'">
      <span v-for="item in computedValueItems" :key="getValue(item)" @click="doClick(item)">{{ getLabel(item) }}</span>
    </template>
    <template v-else>
      <component
        :is="$fsui.tag.name"
        v-for="item in computedValueItems"
        :key="getValue(item)"
        class="fs-tag"
        size="small"
        v-bind="item"
        :icon="null"
        @click="doClick(item)"
      >
        <template v-if="item.icon">
          <fs-icon :icon="item.icon" class="fs-tag-icon" />
        </template>
        {{ getLabel(item) }}
      </component>
    </template>
  </span>
</template>

<script>
import { uiContext } from "../../ui";
import _ from "lodash-es";
import { computed } from "vue";
import { useDict } from "../../use/use-dict";
import trace from "../../utils/util.trace";
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

/**
 * value格式化展示组件
 */
export default {
  name: "FsValuesFormat",
  props: {
    /**
     * 值
     */
    modelValue: {
      require: false
    },
    /**
     * 字典配置
     */
    dict: {},
    /**
     * 是否多选
     */
    multiple: { default: true, require: false },
    /**
     * 分隔符<br/>
     * 多选时，如果value为string，则以该分隔符分割成多个展示<br/>
     * 传入空字符串，表示不分割<br/>
     */
    separator: { default: ",", require: false },

    /**
     * 颜色
     * element=【auto, primary, success, warning, danger ,info】
     * antdv=【auto, primary, success, blue,red,...】
     * 配置auto，则自动根据value值hashcode分配颜色值
     */
    color: {
      require: false
    },
    /**
     * 效果（仅element）
     **/
    effect: {
      require: false
    },
    /**
     * 自动染色颜色值列表
     */
    autoColors: {
      type: Array
    },
    /**
     * 自动主题列表（仅element）
     * 【 light, plain 】
     */
    autoEffects: {
      type: Array
    },
    /**
     * 显示类型：【text, tag】
     */
    type: {
      default: "tag"
    },
    /**
     * 当value值不在字典中时默认显示的文本
     */
    defaultLabel: {}
  },
  emits: ["click", "dict-change"],
  setup(props, ctx) {
    // trace.trace("values-format");
    // console.log("values-format init", props.modelValue);
    //const dict = useDict(props, ctx);
    const ui = uiContext.get();
    const COLOR_LIST = ui.tag.colors;
    const EFFECT_LIST = ["plain", "light"];

    const usedDict = useDict(props, ctx);
    const { getColor, getValue, removePropValue } = usedDict;
    usedDict.watchValue(() => {
      return props.modelValue;
    });
    function setColor(props, item) {
      if (!item.effect && props.effect) {
        item.effect = props.effect;
      }
      const typeKey = ui.tag.type;
      const color = getColor(item);
      if (color != null) {
        //如果已经配置了color
        if (typeof color != "string") {
          return;
        }
        //将原有的color字段删掉，避免naive color报错
        removePropValue(item, "color");
        item[typeKey] = color;
        return;
      }
      if (props.color === "auto") {
        const hashcode = getHashCode(getValue(item));
        const colors = props.autoColors ? props.autoColors : COLOR_LIST;
        item[typeKey] = colors[hashcode % colors.length];
        const effects = props.autoEffects ? props.autoEffects : EFFECT_LIST;
        item.effect = effects[Math.floor(hashcode / colors.length) % effects.length];
      } else {
        item[typeKey] = props.color;
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
        if (props.defaultLabel) {
          _.forEach(options, (item) => {
            if (item[labelProp] == null) {
              item[labelProp] = props.defaultLabel;
            }
          });
        }
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

      const colorfulOptions = [];
      _.forEach(options, (item) => {
        colorfulOptions.push(_.omit(item, "children"));
      });
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
<style lang="less">
.fs-values-format .fs-tag {
  margin: 2px;
  .fs-tag-icon {
  }
}
</style>
