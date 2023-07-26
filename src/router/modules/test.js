import layout from '@/layout/layout.vue'


export default [
    {
        path: '/ccccs',
        meta: { title: "ccccs" },
        component: () => import('@/pages/test/index.vue'),
        name: '122',
        permission: 1,
        children: [
            {
                path: "/myProduction",
                meta: { title: "ccccs" },
                component: () => import('@/pages/test/index.vue'),
                name: "myProduction",
                permission: 1

            }
        ]
    },
    {
        path: '/123',
        meta: { title: "ccccs" },
        component: () => import('@/pages/test/index.vue'),
        name: '1112',
        permission: 1,
        children: [
            {
                path: "/333",
                meta: { title: "ccccs" },
                component: () => import('@/pages/test/index.vue'),
                name: "123123",
                permission: 1

            }
        ]
    }
]