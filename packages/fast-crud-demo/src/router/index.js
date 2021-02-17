import { createRouter, createWebHashHistory } from 'vue-router'
import Layout from '../layout/layout.vue'
import Home from '../views/home'

const routes = [
  {
    path: '/',
    name: 'layout',
    component: Layout,
    redirect: 'index',
    children: [
      {
        path: '/index',
        name: 'index',
        component: Home
        // component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
