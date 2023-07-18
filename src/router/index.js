import { createRouter, createWebHistory } from 'vue-router'
// import store from '@/store/index.js';
import layout from '@/layout/layout.vue'
import Login from '../pages/login/index.vue'
// import asyncRouterMap from './menuRouter.js';

const routerHistory = createWebHistory()
// const routerHistory = createWebHashHistory()
// createWebHashHistory hash 路由
// createWebHistory history 路由
// createMemoryHistory 带缓存 history 路由




const router = createRouter({
  history: routerHistory,
  routes: [
    {
      path: '/',
      name: '首页',
      component: layout,
      redirect: { name: 'home' },
      children: [{
        path: 'home',
        component: () => import('@/pages/home/index.vue'),
        name: 'home'
      }]
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    // {
    //   path: '/404',
    //   name: '404',
    //   component: () => import('@/components/error/404.vue')
    // },
  ]
})


// 获取modules下所有的js文件
const modulesFiles = require.context('./modules', true, /\.js$/)

const asyncRouterMap = modulesFiles.keys().reduce((modules, modulePath) => {
  // 获取每个文件的名称
  // const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
  // 获取文件的内容
  const value = modulesFiles(modulePath)
  // push数据
  modules.push(...value.default)
  return modules
}, [])





// const login = 'login';
// const homeName = '首页';


// router.beforeEach((to, from, next) => {
//   let token = window.localStorage.getItem('token') || '';
//   if (token) {
//     // 权限列表为空则调用 获取权限列表的方法
//     if (store.getters.permissionList.length === 0) {
//       store.dispatch('getPermissionList').then(res => {

//         addRouterList(store.state);
//         // router.addRoutes之后的next()可能会失效，因为可能next()的时候路由并没有完全add完成，使用 next(to) 重新走一遍router.beforeEach这个钩子
//         next(to);
//       });
//     } else if (to.name === login) {          // 跳转的页面是登录页时跳转到主页
//       next({
//         name: homeName
//       });
//     } else {
//       next();
//     }
//     // 已登录
//   } else {
//     // 未登录
//     // 跳转的页面不是登录页面
//     if (to.name !== login && to.name !== 'register') {
//       next({
//         name: 'login'
//       });
//     } else {
//       next();
//     }
//   }


// });

export default router