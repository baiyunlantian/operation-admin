import layout from '@/layout/layout.vue'


export default [
    {
        path: '/user',
        meta: {title: "测试"},
        component: layout,
        name: "user",
        permission: 1,
        children: [
            {
                path: 'index1',
                meta: {title: "测试页面"},
                component: () => import('@/pages/test/index.vue'),
                name: 'index1',
                permission: 1
            },
            {
                path: 'index2',
                meta: {title: "测试页面2222"},
                component: () => import('@/pages/test/index2.vue'),
                name: 'index2',
                permission: 1
            },
        ]
    }
]