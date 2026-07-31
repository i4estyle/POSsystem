<template>
  <header class="cart-header">
    <section class="title-group">
      <h2 class="cart-title">{{ t('pos.orderList') }}</h2>
    </section>
    <span class="items-badge">{{ t('pos.itemsCount', { count: count }) }}</span>
  </header>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

defineProps<{
  count: number;
}>();
</script>
