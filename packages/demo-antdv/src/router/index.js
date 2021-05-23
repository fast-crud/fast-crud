import { createRouter, createWebHashHistory } from "vue-router";
import { routes } from "./resources";
// 进度条
import NProgress from "nprogress";
import "nprogress/nprogress.css";

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

/**
 * 路由拦截
 * 权限验证
 */
router.beforeEach(async (to, from, next) => {
  // // 确认已经加载多标签页数据 https://github.com/d2-projects/d2-admin/issues/201
  // await store.dispatch("d2admin/page/isLoaded");
  // // 确认已经加载组件尺寸设置 https://github.com/d2-projects/d2-admin/issues/198
  // await store.dispatch("d2admin/size/isLoaded");
  // 进度条
  NProgress.start();

  next();
});

router.afterEach((to) => {
  // 进度条
  NProgress.done();
  // // 多页控制 打开新的页面
  // store.dispatch("d2admin/page/open", to);
  // // 更改标题
  // util.title(to.meta.title);
});

export default router;
