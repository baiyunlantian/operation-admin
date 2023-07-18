import layout from '@/layout/layout.vue'


export default [
    {
        path: '/test',
        component: layout,
        name: "测试页面",
        permission: 1,
        children: [
            {
                path: 'index',
                component: () => import('@/pages/test/index.vue'),
                name: '测试页面',
                permission: 1
            }
        ]
    }
]