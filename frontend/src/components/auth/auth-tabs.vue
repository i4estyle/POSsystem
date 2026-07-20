<template>
  <nav class="auth-toggle-tabs" aria-label="Auth Tabs">
    <div class="tab-active-pill" :class="{ 'is-register': authStore.activeTab === 'register' }" />
    <button
      type="button"
      class="tab-button"
      :class="{ active: authStore.activeTab === 'login' }"
      @click="authStore.setActiveTab('login')"
    >
      <span>{{ $t('auth.tabLogin') }}</span>
    </button>
    <button
      type="button"
      class="tab-button"
      :class="{ active: authStore.activeTab === 'register' }"
      @click="authStore.setActiveTab('register')"
    >
      <span>{{ $t('auth.tabRegister') }}</span>
    </button>
  </nav>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth-store';

const authStore = useAuthStore();
</script>
