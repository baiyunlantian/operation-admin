import layout from "@/layout/layout.vue";

export default [
  {
    path: "/",
    meta: { title: "分销管理" },
    component: layout,
    name: "分销管理",
    permission: 1,
    children: [
      // {
      //   path: "/information",
      //   meta: { title: "数据页面" },
      //   component: () =>
      //     import("@/pages/distributionAdm/information/index.vue"),
      //   name: "information",
      //   permission: 1,
      // },
      {
        path: "/financialSystem",
        meta: { title: "财务管理" },
        component: () =>
          import("@/pages/distributionAdm/financialSystem/index.vue"),
        name: "financialSystem",
        permission: 1,
      },
      {
        path: "/orderList",
        meta: { title: "订单列表" },
        component: () => import("@/pages/distributionAdm/orderList/index.vue"),
        name: "orderList",
        permission: 1,
      },
    ],
  },
];
