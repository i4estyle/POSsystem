<template>
  <footer class="auth-footer-container">
    <p class="copyright-text">{{ $t('auth.copyright') }}</p>
    <div class="footer-links">
      <a href="#" class="footer-link" @click.prevent="openLink('help')">{{
        $t('auth.helpLink')
      }}</a>
      <span class="link-separator">•</span>
      <a href="#" class="footer-link" @click.prevent="openLink('contact')">{{
        $t('auth.contactLink')
      }}</a>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';

const $q = useQuasar();

const openLink = (target: string): void => {
  $q.notify({
    type: 'info',
    message: `Navigate to ${target}`,
    position: 'top',
  });
};
</script>
