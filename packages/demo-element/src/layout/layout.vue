<template>
  <el-container class="layout">
    <el-header class="layout-header">
      <div class="header-logo">fast-crud</div>
      <fs-menu
        class="header-menu"
        mode="horizontal"
        background-color="#001529"
        text-color="#fff"
        active-text-color="#fff"
        :menus="headerMenuList"
      />
      <div class="header-right">
        <locale />
        <div>你好，admin</div>
      </div>
    </el-header>
    <el-container class="layout-body">
      <el-aside width="200px" style="border-right: 1px solid #eee">
        <fs-menu :menus="asideMenuList" />
      </el-aside>
      <el-container>
        <el-main>
          <router-view />
        </el-main>
        <el-footer class="layout-footer">
          by fast-crud
          <source-link />
        </el-footer>
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
import { ref } from "vue";
import { asideMenus, headerMenus } from "../router/resources";
import FsMenu from "./components/fs-menu.jsx";
import router from "../router";
import Locale from "./components/locale.vue";
import SourceLink from "./components/source-link/index.vue";
export default {
  components: { Locale, FsMenu, SourceLink },
  setup() {
    const handleNavMenuClick = (key) => {
      if (key.startsWith("http")) {
        window.open(key);
      } else {
        router.push(key);
      }
    };
    const asideMenuList = ref(asideMenus);
    const headerMenuList = ref(headerMenus);
    return {
      handleNavMenuClick,
      asideMenuList,
      headerMenuList
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
    background: #001529;
    color: #fff;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 0 20px 0 0;
    .header-logo {
      width: 100px;
      padding: 0 50px;
    }
    .header-menu {
      flex: 1;
    }
    .header-right {
      font-size: 14px;
      justify-content: flex-end;
      align-items: center;
      display: flex;
      > * {
        margin: 0 5px;
      }
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
