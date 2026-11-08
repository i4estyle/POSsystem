<template>
  <main class="auth-card-container">
    <AuthHeader />
    <div class="form-content-area">
      <AuthLoginForm />
    </div>
  </main>
</template>

<script setup lang="ts">
import AuthHeader from './auth-header.vue';
import AuthLoginForm from './auth-login-form.vue';
</script>
