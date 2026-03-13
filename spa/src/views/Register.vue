<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

// Component State
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const isLoading = ref(false);
const errorMessage = ref('');

// Plugins
const router = useRouter();
const authStore = useAuthStore();

// Methods
const handleRegister = async () => {
  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'Passwords do not match.';
    return;
  }

  isLoading.value = true;
  errorMessage.value = '';
  
  const result = await authStore.register(email.value, password.value);
  
  if (result.success) {
    router.push('/dashboard');
  } else {
    errorMessage.value = result.message || 'Registration failed. Please try again.';
  }
  
  isLoading.value = false;
};
</script>

<template>
  <div class="login-wrapper">
    <div class="login-card">
      <h1>Gold Cargo Smart</h1>
      <h2>Create Account</h2>
      
      <form @submit.prevent="handleRegister">
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

        <div class="input-group">
          <label for="confirmPassword">Confirm Password</label>
          <input 
            id="confirmPassword" 
            v-model="confirmPassword" 
            type="password" 
            required 
          />
        </div>

        <button type="submit" :disabled="isLoading">
          {{ isLoading ? 'Creating Account...' : 'Register' }}
        </button>

        <p v-if="errorMessage" class="error-msg">
          {{ errorMessage }}
        </p>

        <p class="auth-link">
          Already have an account? <router-link to="/login">Sign In</router-link>
        </p>
      </form>
    </div>
  </div>
</template>

<style scoped>
.auth-link {
  margin-top: 1rem;
  text-align: center;
  font-size: 0.9rem;
}
.auth-link a {
  color: var(--primary-color, #0056b3);
  text-decoration: none;
  font-weight: bold;
}
</style>