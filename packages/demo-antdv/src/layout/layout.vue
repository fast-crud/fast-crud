<template>
  <a-layout>
    <a-layout-header class="header">
      <div class="header-logo">fast-crud</div>
      <fs-menu
        class="header-menu"
        theme="dark"
        mode="horizontal"
        :style="{ lineHeight: '64px' }"
        :selectable="false"
        ,@click="handleNavMenuClick"
        :menus="headerMenuList"
      />
      <div class="header-right">
        <locale />
        <div>你好，admin</div>
      </div>
    </a-layout-header>
    <a-layout class="layout-body">
      <a-layout-sider style="overflow-y: scroll">
        <fs-menu :menus="asideMenuList" />
      </a-layout-sider>
      <a-layout-content><router-view /></a-layout-content>
    </a-layout>
    <a-layout-footer
      >by fast-crud
      <source-link />
    </a-layout-footer>
  </a-layout>
</template>

<script>
import FsMenu from "./components/fs-menu.jsx";
import router from "../router";
import Locale from "./components/locale.vue";
import SourceLink from "./components/source-link/index.vue";
import { asideMenus, headerMenus } from "../router/resources";
import { ref } from "vue";
export default {
  name: "Layout",
  // eslint-disable-next-line vue/no-unused-components
  components: { FsMenu, Locale, SourceLink },
  setup() {
    const handleNavMenuClick = ({ key }) => {
      if (key.startsWith("http")) {
        window.open(key);
      } else {
        router.push(key);
      }
    };
    const headerMenuList = ref(headerMenus);
    const asideMenuList = ref(asideMenus);
    return {
      handleNavMenuClick,
      headerMenuList,
      asideMenuList
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
    display: flex;
    justify-content: flex-start;
    align-items: center;
    .header-logo {
      float: left;
      width: 150px;
      // margin: 16px 24px 16px 0;
      //background: rgba(255, 255, 255, 0.3);
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
