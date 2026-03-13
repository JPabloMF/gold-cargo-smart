import { defineStore } from "pinia";
import { ref } from "vue";

export const useAuthStore = defineStore("auth", () => {
  const token = ref(localStorage.getItem("token") || null);
  const user = ref(JSON.parse(localStorage.getItem("user")) || null);

  const login = async (email, password) => {
    try {
      console.log(`[Store] Attempting login for ${email}`);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        token.value = data.token;
        user.value = data.user;
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        console.log(`[Store] Login successful for ${email}`);
        return { success: true };
      }
      
      console.warn(`[Store] Login failed for ${email}: ${data.message}`);
      return { success: false, message: data.message };
    } catch (error) {
      console.error(`[Store] Login error for ${email}:`, error);
      return { success: false, message: "Network error or server unavailable." };
    }
  };

  const register = async (email, password, role = 'user') => {
    try {
      console.log(`[Store] Attempting registration for ${email}`);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await response.json();

      if (data.success) {
        token.value = data.token;
        user.value = data.user;
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        console.log(`[Store] Registration successful for ${email}`);
        return { success: true };
      }
      
      console.warn(`[Store] Registration failed for ${email}: ${data.message}`);
      return { success: false, message: data.message };
    } catch (error) {
      console.error(`[Store] Registration error for ${email}:`, error);
      return { success: false, message: "Network error or server unavailable." };
    }
  };

  const logout = () => {
    console.log(`[Store] Logging out user ${user.value?.email}`);
    token.value = null;
    user.value = null;
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return { token, user, login, register, logout };
});