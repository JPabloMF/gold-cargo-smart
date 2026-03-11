<template>
  <div class="admin-layout">
    <aside class="sidebar">
      <div class="brand">
        <h2>Gold Cargo Admin</h2>
      </div>
      
      <nav class="nav-links">
        <router-link to="/dashboard" exact-active-class="active">Overview</router-link>
        <router-link to="/dashboard/history" active-class="active">Quote History</router-link>
        <router-link to="/dashboard/rates" active-class="active">Rates Management</router-link>
      </nav>

      <button @click="handleLogout" class="logout-btn">Logout</button>
    </aside>

    <main class="content-area">
      <router-view></router-view>
    </main>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};
</script>

<style scoped>
</style>