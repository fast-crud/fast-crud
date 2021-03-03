<template>
  <a-layout>
    <a-layout-header>fast-crud</a-layout-header>
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
export default {
  // eslint-disable-next-line vue/no-unused-components
  components: { AsideMenu },
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
