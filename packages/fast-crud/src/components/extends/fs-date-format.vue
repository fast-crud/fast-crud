<template>
  <span>{{ doFormat }}</span>
</template>

<script lang="ts">
import dayjs from "dayjs";
import { defineComponent } from "vue";
/**
 * 日期格式化展示组件
 */
export default defineComponent({
  name: "FsDateFormat",
  props: {
    /**
     * 日期时间值，支持long,string,date等，由dayjs转化
     */
    modelValue: { required: false },
    /**
     *  输入格式化，不传则由dayjs自动转化
     */
    valueFormat: { type: String, default: undefined, required: false },
    /**
     *  输出格式化
     */
    format: { type: String, default: "YYYY-MM-DD HH:mm:ss", required: false }
  },
  data() {
    return {
      item: {}
    };
  },
  computed: {
    doFormat() {
      if (this.modelValue == null || this.modelValue === "") {
        return "";
      }
      let date = null;
      if (this.valueFormat != null) {
        date = dayjs(this.modelValue, this.valueFormat);
      } else {
        date = dayjs(this.modelValue);
      }
      return date.format(this.format);
    }
  } as any,
  created() {},
  methods: {}
});
</script>
