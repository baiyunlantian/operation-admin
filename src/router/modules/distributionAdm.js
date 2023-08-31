import layout from "@/layout/layout.vue";

export default [
  {
    path: "/",
    meta: { title: "分销管理" },
    component: layout,
    name: "分销管理",
    permission: 1,
    children: [
      {
        path: "/information",
        meta: { title: "数据页面" },
        component: () =>
          import("@/pages/distributionAdm/information/index.vue"),
        name: "information",
        permission: 1,
      },
    ],
  },
];
