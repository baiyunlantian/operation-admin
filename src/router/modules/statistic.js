import layout from '@/layout/layout.vue'


export default [
    {
        path: '/statistic',
        meta: {title: "统计"},
        component: layout,
        name: "统计",
        permission: 1,
        children: [
            {
                path: '',
                component: () => import('@/pages/statistic/index.vue'),
                name: 'statistic',
                permission: 1

            }
        ]
    }
]