import layout from '@/layout/layout.vue'


export default [
  {
    path: '/',
    meta: {title: "个人中心"},
    component: layout,
    name: "个人中心",
    children: [
      {
        path: '/center',
        meta: {title: "个人中心", permission: [10, 20, 0, 1]},
        component: () => import('@/pages/account/center.vue'),
        name: 'info',
      },
      // {
      //   path: '/updatePassword',
      //   meta: {title: "修改密码"},
      //   component: () => import('@/pages/account/updatePassword.vue'),
      //   name: 'updatePassword',
      // },
    ]
  }
]