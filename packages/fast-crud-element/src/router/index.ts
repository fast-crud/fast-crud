import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import Layout from "../layout/layout.vue";
import Home from "../views/home/index.vue";
const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "layout",
    component: Layout,
    redirect: "index",
    children: [
      {
        path: "/index",
        name: "index",
        component: Home,
        // component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'
      },
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
