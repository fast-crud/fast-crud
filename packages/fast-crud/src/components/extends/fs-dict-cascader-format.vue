<template>
  <span>
    <template v-if="multiple">
      <div v-for="(Labels, Index) in multipleLabels" :key="Index">
        <span v-for="(label, index) in Labels" :key="index">
          <span v-if="index !== 0"> / </span>
          <span>{{ label }}</span>
        </span>
      </div>
    </template>
    <template v-else>
      <span v-for="(label, index) in labels" :key="index">
        <span v-if="index !== 0"> / </span>
        <span>{{ label }}</span>
      </span>
    </template>
  </span>
</template>

<script>
import { useDict } from "../../use/use-dict";
// 级联数据格式化组件
export default {
  name: "FsDictCascaderFormat",
  props: {
    // 值<br/>
    // 单选时 '1,2,3' 或 [1,2,3]<br/>
    // 多选[[1,2,3],[4,5,6]]<br/>
    modelValue: {
      type: [String, Array],
      require: true,
    },
    // value的分隔符<br/>
    // 多选时，如果value为string，则以该分隔符分割成多个展示<br/>
    // 传入空字符串，表示不分割<br/>
    separator: { default: ",", require: false },
    // 是否多选
    multiple: { type: Boolean, default: false },
    // 数据字典<br/>
    // 示例：{url:'xxx',data:[],value:'',label:'',children:''}
    dict: {
      type: Object,
      require: false,
    },
  },
  setup(props, ctx) {
    const dict = useDict(props, ctx, true);
    return {
      ...dict,
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
    },
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
      if (
        typeof values === "string" &&
        !this.multiple &&
        this.separator != null &&
        this.separator !== ""
      ) {
        arr = values.split(this.separator);
      } else if (values instanceof Array) {
        arr = values;
      } else {
        arr = [values];
      }
      return arr;
    },
    getDictItem(value, dict, deepMatch) {
      let valueName = "value";
      if (this.dict && this.dict.value) {
        valueName = this.dict.value;
      }
      if (deepMatch) {
        let childrenName = "children";
        if (this.dict && this.dict.children) {
          childrenName = this.dict.children;
        }
        return this.deepMatch(value, valueName, childrenName, dict);
      } else {
        for (const item of dict) {
          if (item[valueName] === value) {
            return item;
          }
        }
      }
    },
    deepMatch(value, valueName, childrenName, dict) {
      for (const item of dict) {
        if (item[valueName] === value) {
          return item;
        }
      }
      for (const item of dict) {
        if (item[childrenName]) {
          const matched = this.deepMatch(
            value,
            valueName,
            childrenName,
            item[childrenName]
          );
          if (matched) {
            return matched;
          }
        }
      }
    },
    buildValueItem(values) {
      const arr = this.getValueArr(values);

      let labelName = "label";
      if (this.dict != null && this.dict.label != null) {
        labelName = this.dict.label;
      }

      let childrenName = "children";
      if (this.dict != null && this.dict.children != null) {
        childrenName = this.dict.children;
      }
      const labelArr = [];

      if (this.dictData != null) {
        let dict = this.dictData;
        const deepMatch = arr.length === 1;
        for (const value of arr) {
          if (dict != null) {
            const dictItem = this.getDictItem(value, dict, deepMatch);
            if (dictItem != null) {
              dict = dictItem[childrenName];
              labelArr.push(dictItem[labelName]);
              continue;
            }
          }
          labelArr.push(value);
        }
      }
      return labelArr;
    },
  },
};
</script>
