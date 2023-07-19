import { createRouter, createWebHistory } from 'vue-router'
import store from '@/store/index.js';
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
      permission: '1',
      component: layout,
      redirect: { name: 'home' },
      children: [{
        path: 'home',
        name: 'home',
        permission: '1',
        component: () => import('@/pages/home/index.vue'),
      }]
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    }
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


// 白名单
const white = ['login', 'register', '404']


router.beforeEach((to, from, next) => {
  let token = window.localStorage.getItem('token') || '';
  if (token) {
    // 权限列表为空则调用 获取权限列表的方法
    if (store.getters['user/permissionList'].length === 0) {
      store.dispatch('user/getPermissionList').then(res => {

        addRouterList(store.state.user.permission);
        // router.addRoutes之后的next()可能会失效，因为可能next()的时候路由并没有完全add完成，使用 next(to) 重新走一遍router.beforeEach这个钩子
        next(to);
      });
    } else if (white.indexOf(to.name) > -1) {          // 跳转的页面是登录页时跳转到主页
      next({
        path: "/"
      });
    } else {
      next();
    }
    // 已登录
  } else {
    // 未登录
    // 跳转的页面不是登录页面
    if (white.indexOf(to.name) < 0) {
      next({
        name: 'login'
      });
    } else {
      next();
    }
  }


});



// 根据权限列表获取添加router列表
function addRouterList(permissionList) {
  let routerList = filterRouter(asyncRouterMap, permissionList)
  routerPackag(routerList)

  store.commit('user/SET_FILTERROUTER_LIST', routerList);
  router.addRoute('404', {
    path: '/:w+',
    redirect: '/404',
    component: layout
  })
}


function filterRouter(routerList, permissionList) {
  let filterRouterList = routerList.filter(item => {
    if (!permissionList.includes(item.permission)) {
      return false
    }
    if (item.children) {
      let children = []
      children = filterRouter(item.children, permissionList)
      item.children = children
      return children.length > 0
    } else {
      return true
    }
  })
  return filterRouterList
}


function routerPackag(routerList, parentPath, pathName = '') {

  routerList.forEach(item => {
    // path格式为 [父/子]
    var path = !!parentPath ? (parentPath + '/' + item.path) : item.path;

    let list = {
      path: path,
      title: item.title,
      mate: item.mate,
      name: item.name,
      component: item.component
    }
    // 设置重定向
    if (item.children && !item.redirect) {
      list.redirect = { name: item.children[0]['name'] }
    }
    // console.log(pathName)
    if (pathName) {
      router.addRoute(pathName, list)
    } else {
      router.addRoute(list)
    }
    if (item.children && item.children.length > 0) {
      routerPackag(item.children, path, item.name);
    }
  })
}

export default router