export default [
  {
    path: "/",
    redirect: "/index-page",
  },
  {
    path: "/index-page",
    name: "index-page",
    component: () => import("../../views/Home/index.vue"),
    meta: {
      title: "首页",
    },
  },
  {
    path: "/index-about",
    name: "index-about",
    component: () => import("../../views/About/index.vue"),
    meta: {
      title: "About页面",
    },
  },
];
