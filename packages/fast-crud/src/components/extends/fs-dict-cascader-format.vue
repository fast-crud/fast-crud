<template>
  <span>
    <template v-if="multiple">
      <div v-for="(Labels, Index) in multipleLabels" :key="Index">
        <span v-for="(item, index) in Labels" :key="index">
          <span v-if="index !== 0"> / </span>
          <span>{{ getLabel(item) }}</span>
        </span>
      </div>
    </template>
    <template v-else>
      <span v-for="(item, index) in labels" :key="index">
        <span v-if="index !== 0"> / </span>
        <span>{{ getLabel(item) }}</span>
      </span>
    </template>
  </span>
</template>

<script>
import { useDict } from "../../use/use-dict";
/**
 * 级联数据格式化展示组件
 */
export default {
  name: "FsDictCascaderFormat",
  props: {
    /**
     *   值<br/>
     *   单选时 '1,2,3' 或 [1,2,3]<br/>
     *   多选[[1,2,3],[4,5,6]]<br/>
     */
    modelValue: {
      type: [String, Array],
      default: undefined,
      require: true
    },
    /**
     *  value的分隔符<br/>
     *  多选时，如果value为string，则以该分隔符分割成多个展示<br/>
     *  传入空字符串，表示不分割<br/>
     */
    separator: { type: String, default: ",", require: false },
    /**
     * 是否多选
     */
    multiple: { type: Boolean, default: false },
    /**
     * 数据字典
     */
    dict: {
      type: Object,
      default: undefined,
      require: false
    }
  },
  emits: ["dict-change"],
  setup(props, ctx) {
    const dict = useDict(props, ctx);
    if (props.dict?.getNodesByValues) {
      dict.watchValue();
    }

    return {
      ...dict
    };
  },
  data() {
    return {};
  },
  computed: {
    labels() {
      if (this.modelValue == null) {
        return [];
      }
      return this.buildValueItem(this.modelValue);
    },
    multipleLabels() {
      if (this.modelValue == null) {
        return [];
      }
      const arr = [];
      for (const item of this.modelValue) {
        arr.push(this.buildValueItem(item));
      }
      return arr;
    }
  },
  methods: {
    getValueArr(values) {
      if (values == null) {
        if (this.multiple) {
          values = [];
          for (const item of this.modelValue) {
            for (const sub of item) {
              values.push(sub);
            }
          }
        } else {
          values = this.modelValue;
        }
      }
      if (values == null) {
        return [];
      }
      let arr = null;
      if (typeof values === "string" && !this.multiple && this.separator != null && this.separator !== "") {
        arr = values.split(this.separator);
      } else if (values instanceof Array) {
        arr = values;
      } else {
        arr = [values];
      }
      return arr;
    },
    buildValueItem(values) {
      const arr = this.getValueArr(values);

      const dict = this.getDict();
      if (dict) {
        return dict.getNodesFromDataMap(arr);
      }
    }
  }
};
</script>
