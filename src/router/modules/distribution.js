import layout from "@/layout/layout.vue";

export default [
  {
    path: "/",
    meta: { title: "分销" },
    component: layout,
    name: "分销",
    permission: 1,
    children: [
      {
        path: "/invite",
        meta: { title: "我的邀新列表" },
        component: () => import("@/pages/distribution/invite.vue"),
        name: "invite",
        permission: 1,
      },
      {
        path: "/distribution",
        meta: { title: "分销管理" },
        component: () => import("@/pages/distribution/distribution.vue"),
        name: "distribution",
        permission: 1,
      },
      {
        path: "/agent",
        meta: { title: "代理管理" },
        component: () => import("@/pages/distribution/agent.vue"),
        name: "agent",
        permission: 1,
      },
      {
        path: "/agentDetail",
        meta: { title: "代理详情" },
        component: () => import("@/pages/distribution/agentDetail.vue"),
        name: "agentDetail",
        permission: 1,
      },
      {
        path: "/sales",
        meta: { title: "销售管理" },
        component: () => import("@/pages/distribution/sales.vue"),
        name: "sales",
        permission: 1,
      },
      {
        path: "/customer",
        meta: { title: "客户管理" },
        component: () => import("@/pages/distribution/customer.vue"),
        name: "customer",
        permission: 1,
      },
    ],
  },
];
