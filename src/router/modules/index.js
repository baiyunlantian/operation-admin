import layout from '@/layout/layout.vue'


export default  [
    {
        top: true,
        path: "/painter",
        meta: { title: "测试页面" },
        component: () => import('@/pages/test/index.vue'),
        name: '测试页面',
        permission: 1
    },

]

