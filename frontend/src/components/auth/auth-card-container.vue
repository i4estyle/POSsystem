<template>
  <main class="auth-card-container">
    <AuthHeader />
    <AuthTabs />
    <div class="form-content-area">
      <Transition name="auth-form-slide" mode="out-in">
        <AuthLoginForm v-if="authStore.activeTab === 'login'" key="login" />
        <AuthRegisterForm v-else key="register" />
      </Transition>
    </div>
  </main>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth-store';
import AuthHeader from './auth-header.vue';
import AuthTabs from './auth-tabs.vue';
import AuthLoginForm from './auth-login-form.vue';
import AuthRegisterForm from './auth-register-form.vue';

const authStore = useAuthStore();
</script>
