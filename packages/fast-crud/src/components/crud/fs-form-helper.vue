<template>
  <div class="fs-form-helper">
    <template v-if="typeof helper === 'string'">{{ helper }}</template>
    <template v-else-if="helper.render">
      <fs-render :render-func="helper.render" :scope="scope" />
    </template>
    <template v-else-if="helper.text">
      {{ helper.text }}
    </template>
  </div>
</template>
<script>
/**
 * 表单字段帮助说明组件
 */
export default {
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
  }
};
</script>
