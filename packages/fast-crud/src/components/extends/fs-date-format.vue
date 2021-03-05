<template>
  <span>{{ doFormat }}</span>
</template>

<script>
import dayjs from "dayjs";
// 日期格式化展示组件
export default {
  name: "DateFormat",
  props: {
    // 日期时间值，支持long,string,date等，由dayjs转化
    value: { required: true },
    // 输入格式化，不传则由dayjs自动转化
    valueFormat: { required: false },
    // 输出格式化
    format: { default: "YYYY-MM-DD HH:mm:ss", required: false },
  },
  data() {
    return {
      item: {},
    };
  },
  computed: {
    doFormat() {
      if (this.value == null || this.value === "") {
        return "";
      }
      let date = null;
      if (this.valueFormat != null) {
        date = dayjs(this.value, this.valueFormat);
      } else {
        date = dayjs(this.value);
      }
      return date.format(this.format);
    },
  },
  created() {},
  methods: {},
};
</script>
