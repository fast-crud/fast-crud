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
import FsRender from "../render/fs-render.jsx";
/**
 * form-item组件封装
 */
export default {
  name: "FsFormHelper",
  components: { FsRender },
  props: {
    helper: {},
    scope: {}
  }
};
</script>
