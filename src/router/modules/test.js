import layout from '@/layout/layout.vue'


export default [
    {
        path: '/ccc',
        component: layout,
        name: "layout",
        permission: 1,
        children: [
            {
                path: 'ccccs',
                component: () => import('@/pages/test/index.vue'),
                name: '122',
                permission: 1

            }
        ]
    }
]