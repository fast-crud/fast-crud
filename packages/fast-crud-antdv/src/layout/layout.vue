<template>

  <a-layout>
    <a-layout-header>fast-crud</a-layout-header>
    <a-layout>
      <a-layout-sider><aside-menu></aside-menu></a-layout-sider>
      <a-layout-content> <router-view></router-view></a-layout-content>
    </a-layout>
    <a-layout-footer>by fast-crud</a-layout-footer>
  </a-layout>
</template>

<script>
import AsideMenu from './menu'
export default {
  components: { AsideMenu }
}
</script>
<style lang="less">
.layout{
  .layout-header{
    height: 64px;
    padding: 0 50px;
    line-height: 64px;
    background: #001529;
    color:#fff;
  }
  .layout-footer{
    padding: 24px 50px;
    color: rgba(0,0,0,.85);
    font-size: 14px;
    background: #f0f2f5;
  }

  .el-aside{
    .el-menu{
      height: 100%;
    }
  }
}

</style>
