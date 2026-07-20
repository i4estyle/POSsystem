<template>
  <footer class="footer-section">
    <address class="branch-badge">
      <q-icon name="storefront" size="14px" />
      <span>{{ branchName }}</span>
    </address>
    <small class="copyright-text">{{ copyright }}</small>
  </footer>
</template>

<script setup lang="ts">
defineProps<{
  branchName: string;
  copyright: string;
}>();
</script>
