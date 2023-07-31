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
  // 指定模式
  history: routerHistory,
  // 默认路由
  routes: [
    {
      path: '/',
      name: '首页',
      meta: {title: "首页"},
      permission: '1',
      component: layout,
      redirect: { path: '/home' },
      children: [{
        path: 'home',
        meta: { title: "首页", tagsDisabled: true },
        name: 'home',
        permission: '1',
        component: () => import('@/pages/home/index.vue'),
      }]
    },
    {
      path: '/login',
      name: 'login',
      meta: {title: "登录页"},
      component: Login
    },
    {
      path: '/404',
      meta: { title: "登录页" },
      component: layout
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




router.beforeResolve((to, from, next) => {
  next()
  return false
})

router.beforeEach(async (to, from, next) => {
  // console.log("beforeEach")
  let token = window.localStorage.getItem('token') || '';
  if (token) {
    // 权限列表为空则调用 获取权限列表的方法
    if (store.getters['user/permissionList'].length === 0) {
      await store.dispatch('user/getPermissionList').then(res => {

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
  // 过滤只有一级分类 但是没有权限
  // let asyncRouterList = asyncRouterMap.filter((item, i) => {
  //   // console.log(!!state.permissionList.includes(item.permission) || !!item['children'], "xxxxxx")
  //   return !!permissionList.includes(item.permission) || !!item['children'];
  // })
  // // 过滤二级分类
  // // 过滤有二级分类但二级分类子类没有权限的
  // // let routerList = permissionList
  // let routerList = asyncRouterList.filter((item, index) => {
  //   if (!!item.children) {
  //     let children = item.children;
  //     item.children = children.filter((item, i) => {
  //       return permissionList.includes(item.permission);
  //     });
  //   }
  //   return !!item.children.length > 0 || !!item['permission'];
  // })
  routerPackag(routerList)

  store.commit('user/SET_FILTERROUTER_LIST', routerList);
  router.addRoute('404', {
    path: '/:pathMatch(.*)',
    redirect: '/404',
    component: layout
  })
}



function filterRouter(routerList, permissionList, fullPath = "") {
  let filterRouterList = routerList.filter(item => {
    item.fullPath = fullPath + item.path
    if (!permissionList.includes(item.permission)) {
      return false
    }
    if (item.children) {
      let children = []

      children = filterRouter(item.children, permissionList, item.path)
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
    var path = !!parentPath ? (parentPath + item.path) : item.path;

    let list = {
      path: path,
      title: item.title,
      meta: item.meta,
      name: item.name,
      component: item.component
    }
    // 设置重定向 兼容动态路由
    if (item.children && !item.redirect) {
      if (item.children[0]['default']) {
        list.redirect = { path: `${path}${item.children[0]['default']}` }
      } else {
        list.redirect = { path: `${path}${item.children[0]['path']}` }
      }

    }
    // console.log(pathName)
    if (pathName) {
      router.addRoute(pathName, list)
    } else {

      router.addRoute(item.top ? "" : "index", list)
    }
    if (item.children && item.children.length > 0) {
      routerPackag(item.children, path, item.name);
    }
  })
}

export default router