<template>
  <el-container class="layout">
    <el-header class="layout-header">
      <el-aside width="200px">fast-crud</el-aside>
      其他菜单
    </el-header>
    <el-container class="layout-body">
      <el-aside width="200px" style="border-right: 1px solid #eee">
        <aside-menu />
      </el-aside>
      <el-container>
        <el-main>
          <router-view />
        </el-main>
        <el-footer class="layout-footer">by fast-crud</el-footer>
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
import AsideMenu from "./aside-menu";
export default {
  components: { AsideMenu }
};
</script>
<style lang="less">
.layout {
  height: 100%;
  .layout-header {
    height: 64px;
    padding: 0 50px;
    line-height: 64px;
    background: #001529;
    color: #fff;
  }
  .layout-body {
    overflow: hidden;
  }
  .layout-footer {
    padding: 24px 50px;
    color: rgba(0, 0, 0, 0.85);
    font-size: 14px;
    background: #f0f2f5;
  }

  .el-aside {
    // border-right: 1px solid #eee;
    overflow: hidden;
    overflow-y: scroll;
    .el-menu {
      border-right: 0;
      height: 100%;
    }
  }
}
</style>
