import layout from '@/layout/layout.vue'


export default [
  {
    path: '/',
    meta: {title: "商品目录"},
    component: layout,
    name: "商品目录",
    children: [
      {
        path: '/product',
        meta: {title: "商品目录", permission: [10, 20, 1]},
        component: () => import('@/pages/product/index.vue'),
        name: 'product',
      },
      {
        path: '/settleAccount',
        meta: {title: "结算商品", permission: [10, 20, 1]},
        component: () => import('@/pages/product/settleAccount.vue'),
        name: 'settleAccount',
      }
    ]
  }
]