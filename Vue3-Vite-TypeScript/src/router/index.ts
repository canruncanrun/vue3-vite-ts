import { createRouter, createWebHashHistory } from "vue-router";
import baseRouters from "./modules/base";

const router = createRouter({
  // -- 部署二级目录：createWebHashHistory(base?: string)
  history: createWebHashHistory(import.meta.env.VITE_APP_BASE),
  // -- 路由
  routes: [
    ...baseRouters,
    {
      path: "/404",
      name: "404",
      component: () => import("../views/404/index.vue"),
    },
    {
      path: "/:pathMatch(.*)",
      redirect: "/404",
    }
  ],
  // -- 滚动行为
  scrollBehavior: () => ({
    el: "#app",
    top: 0,
    behavior: "smooth",
  }),
});

// 导航守卫
router.beforeEach(async (to, from) => {

});

router.afterEach((to) => {
  // → 设置标题
  if (to.path !== "/favicon.icon") {
    document.title = to.meta.title ? (to.meta.title as string) : "";
  }
  // → 滚动
  window.scrollTo(0, 0);
});


export default router;
