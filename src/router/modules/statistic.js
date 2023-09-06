import layout from '@/layout/layout.vue'


export default [
    {
        path: '/',
        meta: {title: "统计"},
        component: layout,
        name: "统计",
        children: [
            {
                path: '/userStatistic',
                meta: {title: "用户统计", permission: [10, 0, 1]},
                component: () => import('@/pages/statistic/user/index.vue'),
                name: 'user',
            },
            {
                path: '/tradingStatistic',
                meta: {title: "交易统计", permission: [10, 0, 1]},
                component: () => import('@/pages/statistic/trading/index.vue'),
                name: 'trading',
            }
        ]
    }
]