import layout from "@/layout/layout.vue";

export default [
  {
    path: "/",
    meta: { title: "分销" },
    component: layout,
    name: "分销",
    children: [
      {
        path: "/invite",
        meta: { title: "我的邀新列表", permission: [10, 0, 1] },
        component: () => import("@/pages/distribution/invite.vue"),
        name: "invite",
      },
      {
        path: "/distribution",
        meta: { title: "分销管理", permission: [10, 1] },
        component: () => import("@/pages/distribution/distribution.vue"),
        name: "distribution",
      },
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
    ],
  },
];
