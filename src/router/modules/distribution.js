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
    ],
  },
];
