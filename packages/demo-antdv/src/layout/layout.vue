<template>
  <a-layout>
    <a-layout-header>
      <div class="logo">fast-crud</div>
      <a-menu
        theme="dark"
        mode="horizontal"
        :style="{ lineHeight: '64px' }"
        :selectable="false"
        @click="handleNavMenuClick"
      >
        <a-menu-item key="http://fast-crud.docmirror.cn/">文档</a-menu-item>
        <a-menu-item key="http://fast-crud.docmirror.cn/element/">element版</a-menu-item>
        <a-menu-item key="https://github.com/fast-crud/fast-crud">gitee</a-menu-item>
        <a-menu-item key="https://gitee.com/fast-crud/fast-crud">github</a-menu-item>
      </a-menu>
    </a-layout-header>
    <a-layout class="layout-body">
      <a-layout-sider style="overflow-y: scroll">
        <aside-menu />
      </a-layout-sider>
      <a-layout-content><router-view /></a-layout-content>
    </a-layout>
    <a-layout-footer>by fast-crud</a-layout-footer>
  </a-layout>
</template>

<script>
import AsideMenu from "./aside-menu.jsx";
import router from "../router";
export default {
  // eslint-disable-next-line vue/no-unused-components
  components: { AsideMenu },
  setup() {
    const handleNavMenuClick = ({ key }) => {
      if (key.startsWith("http")) {
        window.open(key);
      } else {
        router.push(key);
      }
    };
    return {
      handleNavMenuClick
    };
  }
};
</script>
<style lang="less">
.ant-layout {
  height: 100%;
  .ant-layout-header {
    height: 64px;
    padding: 0 50px;
    line-height: 64px;
    background: #001529;
    color: #fff;
    .logo {
      float: left;
      width: 150px;
      // margin: 16px 24px 16px 0;
      //background: rgba(255, 255, 255, 0.3);
    }
  }
  .ant-layout-footer {
    padding: 24px 50px;
    color: rgba(0, 0, 0, 0.85);
    font-size: 14px;
    background: #f0f2f5;
  }
  .ant-layout-content {
    background: #fff;
    height: 100%;
    position: relative;
  }
  .layout-body {
    flex: 1;
  }

  .el-aside {
    .el-menu {
      height: 100%;
    }
  }
}
</style>
