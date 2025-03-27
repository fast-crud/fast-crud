<template>
  <div class="fs-form-helper">
    <pre v-if="typeof helper === 'string'">{{ helper }}</pre>
    <template v-else-if="helper.render">
      <fs-render :render-func="helper.render" :scope="scope" />
    </template>
    <pre v-else-if="helper.text">{{ helper.text }}</pre>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import utils from "../../utils";

/**
 * 表单字段帮助说明组件
 */
export default defineComponent({
  name: "FsFormHelper",
  props: {
    /**
     * 帮助说明, text: 说明文字, render: function(scope) 自定义渲染
     */
    helper: {
      type: [
        /**
         * text: 说明文字,
         * render: function , 自定义render
         */
        Object,
        /**
         * 说明文本
         */
        String
      ]
    },
    scope: {}
  },
  setup(props) {
    utils.trace("fs-form-item");
  }
});
</script>
<style lang="less">
.fs-form-helper {
  color: #7e7e7e;
  line-height: 1.3;
  margin-top: 4px;
  margin-bottom: 6px;

  font-size: 12px;
  pre {
    font-family: inherit;
    white-space: pre-wrap;
    word-wrap: break-word;
    margin-bottom: 0px;
  }
}
</style>
