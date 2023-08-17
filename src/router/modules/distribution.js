import layout from '@/layout/layout.vue'


export default [
  {
    path: '/',
    meta: {title: "分销"},
    component: layout,
    name: "分销",
    permission: 1,
    children: [
      {
        path: '/invite',
        meta: {title: "邀新列表"},
        component: () => import('@/pages/distribution/invite.vue'),
        name: 'invite',
        permission: 1
      },
      {
        path: '/distribution',
        meta: {title: "管理分销用户"},
        component: () => import('@/pages/distribution/distribution.vue'),
        name: 'distribution',
        permission: 1
      },
    ]
  }
]