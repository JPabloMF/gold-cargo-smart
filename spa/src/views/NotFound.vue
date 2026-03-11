<template>
  <div class="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
    <h1 class="text-9xl font-bold text-primary mb-4">404</h1>
    <h2 class="text-2xl font-semibold mb-6 text-gray-800">Page Not Found</h2>
    <p class="text-gray-600 mb-8 max-w-md">
      The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
    </p>
    <router-link to="/">
      <Button label="Back to Dashboard" icon="pi pi-home" />
    </router-link>
  </div>
</template>

<script setup>
import Button from 'primevue/button';
</script>