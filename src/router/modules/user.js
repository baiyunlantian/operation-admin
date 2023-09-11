import layout from '@/layout/layout.vue'


export default [
    {
        path: '/',
        meta: {title: "用户管理"},
        component: layout,
        name: "用户管理",
        children: [
            {
                path: '/member',
                meta: {title: "会员用户列表", permission: [10, 0, 1]},
                component: () => import('@/pages/user/member/index.vue'),
                name: 'member',
            },
            {
                path: '/operate',
                meta: {title: "后台用户列表", permission: [1]},
                component: () => import('@/pages/user/operate/index.vue'),
                name: 'operate',
            },
        ]
    }
]