<template>
  <el-container class="layout">
    <el-header class="layout-header">
      <div class="logo">fast-crud</div>
      <el-menu
        class="el-menu-demo"
        mode="horizontal"
        background-color="#001529"
        text-color="#fff"
        active-text-color="#fff"
        @select="handleNavMenuClick"
      >
        <el-menu-item index="http://fast-crud.docmirror.cn/">文档</el-menu-item>
        <el-menu-item index="https://gitee.com/fast-crud/fast-crud/">gitee</el-menu-item>
        <el-menu-item index="https://github.com/fast-crud/fast-crud/">github</el-menu-item>
      </el-menu>
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
import router from "../../../demo-antdv/src/router";
export default {
  components: { AsideMenu },
  setup() {
    const handleNavMenuClick = (key) => {
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
.layout {
  height: 100%;
  .layout-header {
    height: 64px;
    line-height: 64px;
    padding: 0px;
    background: #001529;
    color: #fff;
    display: flex;
    .logo {
      width: 100px;
      padding: 0 50px;
    }
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
