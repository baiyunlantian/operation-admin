import layout from '@/layout/layout.vue'


export default [
    {
        path: '/test',
        meta: {title: "测试"},
        component: layout,
        name: "test",
        permission: 1,
        children: [
            {
                path: '/index',
                meta: {title: "测试页面"},
                component: () => import('@/pages/test/index.vue'),
                name: '测试页面',
                permission: 1
            },
            
        ]
    }
]