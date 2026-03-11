<template>
  <div class="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
    <div class="text-red-500 mb-6">
      <i class="pi pi-lock" style="font-size: 5rem"></i>
    </div>
    <h1 class="text-4xl font-bold mb-4 text-gray-800">Unauthorized Access</h1>
    <p class="text-gray-600 mb-8 max-w-md">
      You do not have the necessary permissions to view this page. Please log in with an authorized account.
    </p>
    <div class="flex gap-4">
      <router-link to="/login">
        <Button label="Go to Login" severity="primary" />
      </router-link>
      <router-link to="/">
        <Button label="Home" severity="secondary" variant="text" />
      </router-link>
    </div>
  </div>
</template>

<script setup>
import Button from 'primevue/button';
</script>