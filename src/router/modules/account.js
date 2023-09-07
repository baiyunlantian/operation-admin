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
        meta: {title: "个人中心", permission: []},
        component: () => import('@/pages/account/center.vue'),
        name: 'info',
      },
    ]
  }
]