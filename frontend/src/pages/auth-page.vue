<template>
  <q-page class="flex flex-center">
    <div class="auth-page-wrapper">
      <div class="background-ambient-blobs" aria-hidden="true">
        <div class="blob blob-1" />
        <div class="blob blob-2" />
        <div class="blob blob-3" />
      </div>

      <header class="top-nav-bar">
        <LocaleSwitcher />
      </header>

      <div class="center-content-wrapper">
        <AuthBrandBanner />
        <AuthCardContainer />
      </div>

      <AuthFooter />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import LocaleSwitcher from '@/components/base/locale-switcher.vue';
import AuthBrandBanner from '@/components/auth/auth-brand-banner.vue';
import AuthCardContainer from '@/components/auth/auth-card-container.vue';
import AuthFooter from '@/components/auth/auth-footer.vue';
</script>
