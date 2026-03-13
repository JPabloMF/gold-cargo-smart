import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/auth";
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
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
      path: "/register",
      name: "register",
      component: Register,
      meta: { requiresAuth: false },
    },
    {
      path: "/unauthorized",
      name: "unauthorized",
      component: () => import("../views/Unauthorized.vue"),
      meta: { requiresAuth: false },
    },
    {
      // The public facing URL for external users
      path: "/request-quote",
      name: "public-quote",
      component: () => import("../views/Quote/NewQuote.vue"),
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
        {
          path: "rates",
          name: "dashboard-rates",
          component: () => import("../views/Dashboard/DashboardRates.vue"),
        },
      ],
    },
    {
      path: "/:pathMatch(.*)*",
      name: "not-found",
      component: () => import("../views/NotFound.vue"),
    },
  ],
});

// Global Navigation Guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  if (to.meta.requiresAuth && !authStore.token) {
    next({ name: "unauthorized" });
  } else if ((to.path === "/login" || to.path === "/register") && authStore.token) {
    next("/dashboard");
  } else {
    next();
  }
});

export default router;