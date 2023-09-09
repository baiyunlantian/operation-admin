import layout from '@/layout/layout.vue'


export default [
  {
    path: '/',
    meta: {title: "课程用户"},
    component: layout,
    name: "课程用户",
    children: [
      {
        path: '/course',
        meta: {title: "课程用户", permission: [1]},
        component: () => import('@/pages/course/index.vue'),
        name: 'course',
      }
    ]
  }
]