import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/auth";
import Login from "../views/Login.vue";
import Dashboard from "../views/Dashboard/Dashboard.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: "/dashboard",
    },
    {
      path: "/login",
      name: "login",
      component: Login,
      meta: { requiresAuth: false },
    },
    {
      // The public facing URL for external users
      path: "/request-quote",
      name: "public-quote",
      component: () => import("../views/quote/NewQuote.vue"),
      meta: { requiresAuth: false },
    },
    {
      path: "/dashboard",
      component: Dashboard,
      meta: { requiresAuth: true },
      children: [
        {
          path: "",
          name: "dashboard-overview",
          component: () => import("../views/Dashboard/DashboardOverview.vue"),
        },
        {
          path: "history",
          name: "dashboard-history",
          component: () => import("../views/Dashboard/DashboardHistory.vue"),
        },
      ],
    },
  ],
});

// Global Navigation Guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  if (to.meta.requiresAuth && !authStore.token) {
    next("/login");
  } else if (to.path === "/login" && authStore.token) {
    next("/dashboard");
  } else {
    next();
  }
});

export default router;
