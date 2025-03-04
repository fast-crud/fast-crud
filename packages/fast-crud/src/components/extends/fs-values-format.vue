<template>
  <span class="fs-values-format">
    <template v-if="itemRender">
      <fs-render v-for="item in computedValueItems" :key="getValue(item)" :render-func="itemRender" :scope="item" />
    </template>
    <template v-else-if="type === 'text'">
      <span v-for="item in computedValueItems" :key="getValue(item)" @click="doClick(item)">{{ getLabel(item) }}</span>
    </template>
    <template v-else>
      <template v-for="(item, index) in computedValueItems" :key="getValue(item)">
        <component
          :is="ui.tag.name"
          class="fs-tag"
          size="small"
          :closable="closable"
          v-bind="item"
          :icon="null"
          :name="null"
          @close="doClose(index, item)"
          @click="doClick(item)"
        >
          <template v-if="item.icon">
            <fs-icon :icon="item.icon" :spin="item.iconSpin" class="fs-tag-icon" />
          </template>
          {{ getLabel(item) }}
        </component>
      </template>
    </template>
  </span>
</template>

<script lang="ts">
import { forEach, omit } from "lodash-es";
import { computed, defineComponent, Ref } from "vue";
import { useDict } from "../../use/use-dict";
import { useUi } from "../../use";
function getHashCode(str: string) {
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

function buildArrayValue(props: any) {
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
export default defineComponent({
  name: "FsValuesFormat",
  props: {
    /**
     * 值
     */
    modelValue: {},
    /**
     * 字典配置
     */
    dict: {},
    /**
     * 是否多选
     */
    multiple: { default: true },
    /**
     * 分隔符<br/>
     * 多选时，如果value为string，则以该分隔符分割成多个展示<br/>
     * 传入空字符串，表示不分割<br/>
     */
    separator: { default: "," },

    /**
     * 颜色
     * element=【auto, primary, success, warning, danger ,info】
     * antdv=【auto, primary, success, blue,red,...】
     * 配置auto，则自动根据value值hashcode分配颜色值
     */
    color: {},
    /**
     * 效果（仅element）
     **/
    effect: {},
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
     * 值的类型，【 value | object】
     */
    valueType: {
      type: String
    },
    /**
     * 当value值不在字典中时默认显示的文本
     */
    defaultLabel: {},

    /**
     * label自定义render
     */
    labelFormatter: {
      type: Function
    },
    /**
     * 自定义选项render
     */
    itemRender: {
      type: Function
    },

    closable: {
      type: Boolean,
      default: false
    }
  },
  emits: ["click", "dict-change", "close", "update:modelValue"],
  setup(props: any, ctx: any) {
    // trace.trace("values-format");
    // console.log("values-format init", props.modelValue);
    //const dict = useDict(props, ctx);
    const { ui } = useUi();
    const COLOR_LIST = ui.tag.colors;
    const EFFECT_LIST = ["plain", "light"];

    const usedDict = useDict(props, ctx);
    const { getColor, getValue, removePropValue } = usedDict;
    usedDict.watchValue();
    function setColor(props: any, item: any) {
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

    const computedValueItems: Ref<any[]> = computed(() => {
      if (props.valueType === "object") {
        if (props.modelValue && !Array.isArray(props.modelValue)) {
          return [props.modelValue];
        }
        return props.modelValue;
      }

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
        //设置默认label
        forEach(options, (item) => {
          if (item[labelProp] == null) {
            item[labelProp] = props.defaultLabel || item[valueProp];
          }
        });
      } else {
        options = [];
        forEach(valueArr, (item) => {
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

      const colorfulOptions: any = [];
      forEach(options, (item) => {
        colorfulOptions.push(omit(item, "children"));
      });
      forEach(colorfulOptions, (item) => {
        setColor(props, item);
      });
      return colorfulOptions;
    });

    function doClick(item: any) {
      ctx.emit("click", { item: item });
    }
    function doClose(index: number, item: any) {
      ctx.emit("close", { item, index });
      const newValues: any[] = [];
      for (let i = 0; i < computedValueItems.value.length; i++) {
        if (i !== index) {
          newValues.push(getValue(computedValueItems.value[i]));
        }
      }
      ctx.emit("update:modelValue", newValues);
    }

    return {
      ui,
      ...usedDict,
      doClick,
      computedValueItems,
      doClose
    };
  }
});
</script>
<style lang="less">
.fs-values-format .fs-tag {
  margin: 2px;
  cursor: pointer;
  .fs-tag-icon {
  }
}
</style>
