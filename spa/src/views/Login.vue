<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

// Component State
const email = ref('admin@goldcargo.com'); 
const password = ref('password123');
const isLoading = ref(false);
const errorMessage = ref('');

// Plugins
const router = useRouter();
const authStore = useAuthStore();

// Methods
const handleLogin = async () => {
  isLoading.value = true;
  errorMessage.value = '';
  
  // Call the Pinia action which hits your Node API
  const success = await authStore.login(email.value, password.value);
  
  if (success) {
    // If the token is received and saved, push to the protected route
    router.push('/dashboard');
  } else {
    errorMessage.value = 'Invalid credentials. Please check your email and password.';
  }
  
  isLoading.value = false;
};
</script>

<template>
  <div class="login-wrapper">
    <div class="login-card">
      <h1>Gold Cargo Smart</h1>
      
      <form @submit.prevent="handleLogin">
        <div class="input-group">
          <label for="email">Email Address</label>
          <input 
            id="email" 
            v-model="email" 
            type="email" 
            required 
          />
        </div>

        <div class="input-group">
          <label for="password">Password</label>
          <input 
            id="password" 
            v-model="password" 
            type="password" 
            required 
          />
        </div>

        <button type="submit" :disabled="isLoading">
          {{ isLoading ? 'Authenticating...' : 'Sign In' }}
        </button>

        <p v-if="errorMessage" class="error-msg">
          {{ errorMessage }}
        </p>
      </form>
    </div>
  </div>
</template>

<style scoped>

</style>