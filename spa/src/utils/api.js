import { useAuthStore } from "@/stores/auth";
import router from "@/router";

export const apiFetch = async (url, options = {}) => {
  const authStore = useAuthStore();

  const headers = {
    ...(options.headers || {}),
  };

  if (authStore.token) {
    headers["Authorization"] = `Bearer ${authStore.token}`;
  }

  const response = await fetch(url, { ...options, headers });

  if (response.status === 401) {
    authStore.logout();
    router.push({ name: "login" });
  }

  return response;
};
