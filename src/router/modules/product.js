import layout from '@/layout/layout.vue'


export default [
  {
    path: '/',
    meta: {title: "商品目录"},
    component: layout,
    name: "商品目录",
    permission: 1,
    children: [
      {
        path: '/product',
        meta: {title: "商品目录"},
        component: () => import('@/pages/product/index.vue'),
        name: 'product',
        permission: 1
      },
      {
        path: '/settleAccount',
        meta: {title: "结算商品"},
        component: () => import('@/pages/product/settleAccount.vue'),
        name: 'settleAccount',
        permission: 1
      }
    ]
  }
]