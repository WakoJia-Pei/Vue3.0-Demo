/**
 * @Description:
 * @Author: Wan.Jiang
 * @Date: 2020-10-23
 **/
// import VueRouter from 'vue-router'
import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import store from "@/store";

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { title: '登录界面' }
  },
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
    meta: { title: '首页', requireAuth: true }
  },
  {
    path: '/*',
    redirect: '/'
  }
]
const router = createRouter({
  history: createWebHistory(), // hash模式：createWebHashHistory，history模式：createWebHistory
  base: process.env.BASE_URL,
  routes
})
// 实现全局路由守卫
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title;
  }

  if (to.meta.requireAuth) {
    // console.log('Vuex状态管理的变量', store.state.userInfo.data)
    if (store.state.userInfo.data.token) {
      if (to.path == '/login') {
        next('/');
      } else {
        next();
      }
    } else {
      next('/login');
    }
  } else {
    if (store.state.userInfo.data.token) {
      next('/');
    } else {
      next();
    }
  }
})

export default router
