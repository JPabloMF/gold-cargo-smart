<template>
  <div class="dashboard-container">
    <h1>Dashboard</h1>
    <button @click="handleLogout">Logout</button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const handleLogout = () => {
  // Clear the token and user data from Pinia and localStorage
  authStore.logout();
  
  // Redirect back to the login page
  router.push('/login');
};
</script>

<style scoped>
</style>