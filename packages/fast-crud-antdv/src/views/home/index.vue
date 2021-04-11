<template>
  <fs-container class="home—index">
    <page-cover />
    <template #footer>
      <div class="footer_box">
        <div class="left"></div>
        <div class="right">
          <div>
            如果觉得好用，请不要吝啬你的star哟！
          </div>
          <a href="https://gitee.com/fast-crud/fast-crud" target="_blank"
            ><img
              src="https://gitee.com/fast-crud/fast-crud/badge/star.svg?theme=dark"
              alt="star"
          /></a>
          <a href="https://github.com/fast-crud/fast-crud" target="_blank"
            ><img
              alt="GitHub stars"
              src="https://img.shields.io/github/stars/fast-crud/fast-crud?logo=github"
          /></a>
        </div>
      </div>
    </template>
  </fs-container>
</template>

<script>
import { defineComponent } from "vue";
import PageCover from "./page-cover/index.vue";
export default defineComponent({
  components: { PageCover },
  setup() {}
});
</script>
<style lang="less">
.home—index {
  .footer_box {
    padding: 10px;
    display: flex;
    justify-content: space-between;
    .right {
      display: flex;
      justify-items: center;
      align-items: center;
      & > * {
        display: flex;
      }
    }
  }
}
</style>
