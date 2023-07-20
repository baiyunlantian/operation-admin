import layout from '@/layout/layout.vue'


export default [
    {
        path: '',
        meta: {title: "用户管理"},
        component: layout,
        name: "用户管理",
        permission: 1,
        children: [
            {
                path: '/member',
                meta: {title: "会员用户列表"},
                component: () => import('@/pages/user/member.vue'),
                name: 'member',
                permission: 1
            },
            {
                path: '/operate',
                meta: {title: "运营后台用户列表"},
                component: () => import('@/pages/user/operate.vue'),
                name: 'operate',
                permission: 1
            },
        ]
    }
]