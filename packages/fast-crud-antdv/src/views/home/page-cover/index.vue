<template>
  <div class="d2-page-cover">
    <div
      class="d2-page-cover__title"
      @click="$open('https://github.com/fast-crud/fast-crud')"
    >
      <div class="title-line">
        <img width="50" src="./image/logo.svg" />
        Fast Crud v{{ version }}
      </div>
    </div>
    <p class="d2-page-cover__sub-title">
      面向配置的crud编程，快速开发crud功能
    </p>
    <div class="exampleBox">
      <div class="left">
        <d2-highlight :code="helper.crud" lang="javascript" />
      </div>
      <div class="icon">
        <fs-icon :icon="$fsui.icons.arrowRight" />
      </div>
      <div class="right">
        <img src="./image/gif.webp" />
      </div>
    </div>
  </div>
</template>
<script>
import helper from "./helper";

import { defineComponent, ref } from "vue";
export default defineComponent({
  name: "PageCover",
  setup() {
    const version = ref(import.meta.env.VITE_APP_VERSION);

    return {
      version
    };
  },
  data() {
    return {
      helper: helper
    };
  }
});
</script>
<style lang="less" scoped>
.d2-page-cover {
  .logo {
    width: 40px;
    height: 40px;
  }
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  .d2-page-cover__logo {
    img {
      width: 200px;
    }
  }
  .d2-page-cover__title {
    margin: 20px;
    font-weight: bold;
    display: -webkit-flex; /* Safari */
    display: flex;
    justify-content: flex-end;
    .title-line {
      display: flex;
      align-items: center;
      flex-direction: row;
      justify-content: center;
      cursor: pointer;
      font-size: 20px;
    }
  }
  .d2-page-cover__sub-title {
    margin: 0px;
    margin-bottom: 10px;
  }
  .d2-page-cover__build-time {
    margin: 0px;
    margin-bottom: 0px;
    margin-top: 10px;
    font-size: 12px;
  }

  .exampleBox {
    display: flex;
    align-items: center;
    height: 380px;
    width: 96%;
    padding: 5px;
    margin: auto;
    justify-content: center;
    .left {
      height: 100%;
      overflow-y: hidden;
      border: 1px solid #aaa;
    }
    .icon {
      padding: 10px;
      font-size: 20px;
    }
    .right {
      height: 100%;
      img {
        height: 100%;
      }
    }
    .d2-highlight {
      font-size: 8px;
    }
  }

  .toStar {
    position: absolute;
    top: 20px;
    right: 150px;
    border: 0;
    color: #4cc134;
    margin: 10px;
    animation: changeshadow 1s ease-in infinite;
    /* 其它浏览器兼容性前缀 */
    -webkit-animation: changeshadow 1s linear infinite;
    -moz-animation: changeshadow 1s linear infinite;
    -ms-animation: changeshadow 1s linear infinite;
    -o-animation: changeshadow 1s linear infinite;
  }
  @keyframes changeshadow {
    0% {
      text-shadow: 0 0 4px #4cc134;
    }
    50% {
      text-shadow: 0 0 40px #4cc134;
    }
    100% {
      text-shadow: 0 0 4px #4cc134;
    }
  }
  @-webkit-keyframes changeshadow {
    0% {
      text-shadow: 0 0 4px #4cc134;
    }
    50% {
      text-shadow: 0 0 40px #4cc134;
    }
    100% {
      text-shadow: 0 0 4px #4cc134;
    }
  }
  @-moz-keyframes changeshadow {
    0% {
      text-shadow: 0 0 4px #4cc134;
    }
    50% {
      text-shadow: 0 0 40px #4cc134;
    }
    100% {
      text-shadow: 0 0 4px #4cc134;
    }
  }
  @-ms-keyframes changeshadow {
    0% {
      text-shadow: 0 0 4px #4cc134;
    }
    50% {
      text-shadow: 0 0 40px #4cc134;
    }
    100% {
      text-shadow: 0 0 4px #4cc134;
    }
  }
  @-o-keyframes changeshadow {
    0% {
      text-shadow: 0 0 4px #4cc134;
    }
    50% {
      text-shadow: 0 0 40px #4cc134;
    }
    100% {
      text-shadow: 0 0 4px #4cc134;
    }
  }
}
</style>
