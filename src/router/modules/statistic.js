import layout from '@/layout/layout.vue'


export default [
    {
        path: '/',
        meta: {title: "统计"},
        component: layout,
        name: "统计",
        permission: 1,
        children: [
            {
                path: '/userStatistic',
                meta: {title: "用户统计"},
                component: () => import('@/pages/statistic/user/index.vue'),
                name: 'user',
                permission: 1
            },
            {
                path: '/trading',
                meta: {title: "交易统计"},
                component: () => import('@/pages/statistic/trading/index.vue'),
                name: 'trading',
                permission: 1
            }
        ]
    }
]