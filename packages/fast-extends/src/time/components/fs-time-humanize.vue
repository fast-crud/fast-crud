<template>
  <span>{{ formatted }}</span>
</template>

<script lang="ts">
import dayjs, { Dayjs } from "dayjs";
import { computed, defineComponent, PropType } from "vue";
import { merge } from "lodash-es";
import humanizeDuration, { HumanizerOptions } from "humanize-duration";

const defaultOptions = {
  language: "zh_CN",
  largest: 1,
  maxDecimalPoints: 0
};
/**
 * 日期人性化格式展示组件
 * 例如几天前，几分钟前，几个小时前
 */
export default defineComponent({
  name: "FsTimeHumanize",
  props: {
    /**
     * 日期时间值，支持long,string,date等，由dayjs转化
     */
    modelValue: { required: false, default: undefined },
    /**
     *  输入格式化，不传则由dayjs自动转化
     */
    valueFormat: { type: String, default: undefined, required: false },
    /**
     *  日期输出格式化
     */
    format: { type: String, default: "YYYY-MM-DD HH:mm:ss", required: false },

    /**
     * 距离时间超过多少毫秒时，直接使用format格式，默认大于3天后
     */
    useFormatGreater: { type: Number, default: 1000 * 60 * 60 * 24 * 3, required: false },

    /**
     * HumanizeDuration参数
     * https://github.com/EvanHahn/HumanizeDuration.js
     */
    options: {
      type: Object as PropType<HumanizerOptions>,
      default() {
        return {};
      }
    },

    /**
     * 前后文本
     */
    text: {
      type: Object as PropType<{ prev: string; after: string }>,
      default() {
        return {};
      }
    }
  },
  setup(props: any) {
    const formatted = computed(() => {
      if (props.modelValue == null || props.modelValue === "") {
        return "";
      }

      let date: Dayjs;
      if (props.valueFormat != null) {
        date = dayjs(props.modelValue, props.valueFormat);
      } else {
        date = dayjs(props.modelValue);
      }

      let duration = dayjs().valueOf() - date.valueOf();
      let suffix = props.text.ago ?? "前";
      if (duration < 0) {
        suffix = props.text.after ?? "后";
        duration = -duration;
      }
      if (duration > props.useFormatGreater) {
        //间隔时长超过3天，则直接显示格式化时间
        return date.format(props.format);
      }
      return humanizeDuration(duration, merge({}, defaultOptions, props.options)) + suffix;
    });

    return {
      formatted
    };
  }
});
</script>
