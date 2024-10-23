<template>
  <span>
    <template v-if="computedMultiple">
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

<script lang="ts">
import { useDict } from "../../use/use-dict";
import { computed, defineComponent } from "vue";
/**
 * 级联数据格式化展示组件
 */
export default defineComponent({
  name: "FsDictCascaderFormat",
  props: {
    /**
     *   值<br/>
     *   单选时 '1,2,3' 或 [1,2,3]<br/>
     *   多选[[1,2,3],[4,5,6]]<br/>
     */
    // @ts-ignore
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
    // @ts-ignore
    separator: { type: String, default: ",", require: false },
    /**
     * 是否多选
     */
    // @ts-ignore
    multiple: { type: Boolean, default: false },
    /**
     * 数据字典
     */
    dict: {
      type: Object,
      default: undefined,
      require: false
    }
  } as any,
  emits: ["dict-change"],
  setup(props, ctx) {
    const dict = useDict(props, ctx);
    // @ts-ignore
    if (props.dict?.getNodesByValues) {
      dict.watchValue();
    }

    const computedMultiple = computed(() => {
      // @ts-ignore
      return props.multiple;
    });

    return {
      ...dict,
      computedMultiple
    };
  },
  data() {
    return {};
  },
  computed: {
    labels() {
      // @ts-ignore
      if (this.modelValue == null) {
        return [];
      }
      // @ts-ignore
      return this.buildValueItem(this.modelValue);
    },
    multipleLabels() {
      // @ts-ignore
      if (this.modelValue == null) {
        return [];
      }
      const arr = [];
      // @ts-ignore
      for (const item of this.modelValue) {
        // @ts-ignore
        arr.push(this.buildValueItem(item));
      }
      return arr;
    }
  },
  methods: {
    getValueArr(values: any) {
      if (values == null) {
        // @ts-ignore
        if (this.multiple) {
          values = [];
          // @ts-ignore
          for (const item of this.modelValue) {
            for (const sub of item) {
              values.push(sub);
            }
          }
        } else {
          // @ts-ignore
          values = this.modelValue;
        }
      }
      if (values == null) {
        return [];
      }
      let arr = null;
      // @ts-ignore
      if (typeof values === "string" && !this.multiple && this.separator != null && this.separator !== "") {
        // @ts-ignore
        arr = values.split(this.separator);
      } else if (values instanceof Array) {
        arr = values;
      } else {
        arr = [values];
      }
      return arr;
    },
    buildValueItem(values: any) {
      // @ts-ignore
      const arr = this.getValueArr(values);

      // @ts-ignore
      const dict = this.getDict();
      if (dict) {
        return dict.getNodesFromDataMap(arr);
      }
    }
  }
});
</script>
