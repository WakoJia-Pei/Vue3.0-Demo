/**
 * @Description:
 * @Author: Wan.Jiang
 * @Date: 2020-10-23
 **/
import { createRouter, createWebHashHistory } from 'vue-router'
import Layout from '@/components/layout'

export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/user'),
    meta: {title: '登录'},
    hidden: true,
  },
  {
    path: '/403',
    name: '403',
    component: () => import('@/views/403'),
    hidden: true,
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/404'),
    hidden: true,
  },
  // {
  //   path: '/upload',
  //   name: 'Upload',
  //   component: () => import('@/views/Upload.vue'),
  //   meta: { title: '首页', requireAuth: true }
  // },
]

export const asyncRoutes = [
  {
    path: '/',
    component: Layout,
    redirect: '/index',
    meta: {
      title: '首页',
      icon: 'home-4-line',
      affix: true,
    },
    children: [
      {
        path: 'index',
        name: 'Index',
        component: () => import('@/views/index'),
        meta: {
          title: '首页',
          icon: 'home-4-line',
          affix: true,
          requireAuth: true
        },
      },
    ],
  },
  {
    path: '/componentsLib',
    component: Layout,
    redirect: '/componentsLib/table',
    alwaysShow: true,
    meta: { title: '组件', icon: 'apps-line' },
    children: [
      {
        path: 'table',
        name: 'Table',
        component: () => import('@/views/componentsLib/table'),
        meta: {
          title: '表格',
          icon: 'table-2',
        },
      },
      {
        path: 'icon',
        name: 'Icon',
        component: () => import('@/views/componentsLib/icon'),
        meta: {
          title: '图标',
          icon: 'remixicon-line',
        },
      },
    ],
  },
  // {
  //   path: '/test',
  //   component: Layout,
  //   redirect: '/test/test',
  //   meta: {
  //     title: '动态路由测试',
  //     icon: 'test-tube-line',
  //   },
  //   children: [
  //     {
  //       path: 'test',
  //       name: 'Test',
  //       component: () => import('@/views/test'),
  //       meta: {
  //         title: '动态路由测试',
  //         icon: 'test-tube-line',
  //       },
  //     },
  //   ],
  // },
  // {
  //   path: '/error',
  //   name: 'Error',
  //   component: Layout,
  //   redirect: '/error/403',
  //   meta: {
  //     title: '错误页',
  //     icon: 'error-warning-line',
  //   },
  //   children: [
  //     {
  //       path: '403',
  //       name: 'Error403',
  //       component: () => import('@/views/403'),
  //       meta: {
  //         title: '403',
  //         icon: 'error-warning-line',
  //       },
  //     },
  //     {
  //       path: '404',
  //       name: 'Error404',
  //       component: () => import('@/views/404'),
  //       meta: {
  //         title: '404',
  //         icon: 'error-warning-line',
  //       },
  //     },
  //   ],
  // },
  {
    path: '/*',
    redirect: '/404',
    hidden: true,
  },
]

const router = createRouter({
  history: createWebHashHistory(), // hash模式：createWebHashHistory，history模式：createWebHistory
  base: process.env.BASE_URL,
  routes: constantRoutes
})

export function resetRouter() {
  router.matcher = createRouter({
    history: createWebHashHistory(), // hash模式：createWebHashHistory，history模式：createWebHistory
    base: process.env.BASE_URL,
    routes: constantRoutes
  }).matcher
}

export default router
