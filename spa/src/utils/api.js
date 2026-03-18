import { useAuthStore } from "@/stores/auth";
import router from "@/router";

export const apiFetch = async (url, options = {}) => {
  const response = await fetch(url, options);

  if (response.status === 401) {
    const authStore = useAuthStore();
    authStore.logout();
    router.push({ name: "login" });
  }

  return response;
};
