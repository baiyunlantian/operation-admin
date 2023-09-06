import layout from "@/layout/layout.vue";

export default [
  {
    path: "/",
    meta: { title: "分销管理" },
    component: layout,
    name: "分销管理",
    children: [
      {
        path: "/agent",
        meta: { title: "代理管理" , permission: [10, 1]},
        component: () => import("@/pages/distribution/agent.vue"),
        name: "agent",
      },
      {
        path: "/agentDetail",
        meta: { title: "代理详情", permission: [10, 1] },
        component: () => import("@/pages/distribution/agentDetail.vue"),
        name: "agentDetail",
      },
      {
        path: "/sales",
        meta: { title: "销售管理", permission: [10, 1] },
        component: () => import("@/pages/distribution/sales.vue"),
        name: "sales",
      },
      {
        path: "/customer",
        meta: { title: "客户管理", permission: [10, 20, 1] },
        component: () => import("@/pages/distribution/customer.vue"),
        name: "customer",
      },
      {
        path: "/financialSystem",
        meta: { title: "财务管理", permission: [1] },
        component: () =>
          import("@/pages/distributionAdm/financialSystem/index.vue"),
        name: "financialSystem",
      },
      {
        path: "/orderList",
        meta: { title: "订单列表", permission: [10, 20, 0, 1] },
        component: () => import("@/pages/distributionAdm/orderList/index.vue"),
        name: "orderList",
      },
    ],
  },
];
