import layout from '@/layout/layout.vue'


export default [

    {
        top: true,
        path: "/painter",
        meta: { title: "测试页面" },
        component: () => import('@/pages/test/index.vue'),
        name: '测试页面',
        permission: 1
    },
    {
        path: '/home',
        meta: { title: "首页"},
        component: () => import('@/pages/home/index.vue'),
        name: 'home',
        permission: '1',
    },

]

