import layout from '@/layout/layout.vue'


export default [
  {
    path: '/',
    meta: {title: "个人资料"},
    component: layout,
    name: "个人资料",
    permission: 1,
    children: [
      {
        path: '/info',
        meta: {title: "个人资料"},
        component: () => import('@/pages/account/info.vue'),
        name: 'info',
        permission: 1
      },
      {
        path: '/updatePassword',
        meta: {title: "修改密码"},
        component: () => import('@/pages/account/updatePassword.vue'),
        name: 'updatePassword',
        permission: 1
      },
    ]
  }
]