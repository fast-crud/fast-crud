import { createRouter, createWebHashHistory } from "vue-router";
import { routes } from "./resources";

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;
